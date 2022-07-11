import { Profile } from "../models/profile/profile.js"
import { Post } from "../models/post/post.js"

const create = async (req, res) => {
  try {
    const post = await Post.create(req.body)
    await Profile.updateOne(
      { _id: req.user.profile },
      { $push: { posts: post } }
    )
    res.status(201).json(post)
  } catch (err) {
    res.status(500).json(err)
  }
}

const index = async (req, res) => {
  try {
    const { search, page, sort } = req.query
    const limit = req.query.limit ? req.query.limit : 10
    const filter = { text: { $regex: search, $options: 'i' } }
    const fields = 'text codeblock author resolved views language'
    const order = { recent: { createdAt: 'desc' }, popular: { comments: 'desc' } }
    const posts = await Post.find(search ? filter : {}, fields)
      .limit(limit)
      .skip(parseInt(page) * limit)
      .populate('author', 'name avatar')
      .sort(sort ? order[sort] : order.recent)
    res.status(200).json(posts)
  } catch (err) {
    res.status(500).json(err)
  }
}

const show = async (req, res) => {
  try {
    const limit = 8
    const page = req.query.page ? parseInt(req.query.page) * limit : 0
    const [post] = await Post.findByIdAndSortComments(req.params.id, page, limit)
    res.status(200).json(post)
  } catch (err) {
    console.log(err)
    res.status(500).json(err)
  }
}

const update = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)
    if (!post.author.equals(req.user.profile)) {
      res.status(401).json({ msg: 'Unauthorized' })
    } else {
      post.resolved = true
      await post.save()
      res.status(200).json(post)
    }
  } catch (err) {
    res.status(500).json(err)
  }
}

const deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)
    if (!post.author.equals(req.user.profile)) {
      res.status(401).json({ msg: 'Unauthorized' })
    } else {
      const profile = await Profile.findById(req.user.profile)
      profile.posts.remove({ _id: req.params.id })
      await Promise.all([
        await post.delete(),
        await profile.save(),
        await Profile.updateMany({}, { $pull: { bookmarks: req.params.id } })
      ])
      res.status(200).send('OK')
    }
  } catch (err) {
    console.log(err)
    res.status(500).json(err)
  }
}

const createComment = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)
    post.comments.push(req.body)
    await post.save()
    const newComment = post.comments[post.comments.length - 1]
    const profile = await Profile.findById(req.user.profile, 'name avatar')
    newComment.author = profile
    res.status(201).json(newComment)
  } catch (err) {
    console.log(err)
    res.status(500).json(err)
  }
}

const updateComment = async (req, res) => {
  try {
    const post = await Post.findById(req.params.postId)
      .populate('author').populate('comments.author')
    const comment = post.comments.id(req.params.commentId)
    if (!post.author.equals(req.user.profile)) {
      res.status(401).json({ msg: 'Unauthorized' })
    } else {
      post.resolved = true
      comment.solution = true
      await Promise.all([
        await post.save(),
        await Profile.updateOne(
          { _id: comment.author._id },
          { $push: { solution_count: { language: post.language, post: post._id } } }
        )
      ])
      res.status(200).json(post)
    }
  } catch (err) {
    res.status(500).json(err)
  }
}

const deleteComment = async (req, res) => {
  try {
    const post = await Post.findById(req.params.postId)
    const comment = post.comments.id(req.params.commentId)
    if (!comment.author.equals(req.user.profile)) {
      res.status(401).json({ msg: 'Unauthorized' })
    } else {
      post.comments.remove({ _id: req.params.commentId })
      await Promise.all([
        await post.save(),
        await Profile.updateMany({},
          { $pull: { votes: { commentId: req.params.commentId } } }
        )
      ])
      res.status(200).send('OK')
    }
  } catch (err) {
    console.log(err)
    res.status(500).json(err)
  }
}

const castVote = async (req, res) => {
  try {
    const vote = req.body.vote
    const { postId, commentId } = req.params
    const profile = await Profile.findById(req.user.profile, 'votes')
    const prevVote = profile.votes.find((v) => v.commentId === commentId)
    if (prevVote) {
      if (prevVote.vote === vote) {
        res.status(401).json({
          msg: `You cannot ${vote === 1 ? 'upvote' : 'downvote'} the same comment twice!`
        })
      } else {
        const post = await Post.findById(postId, 'comments')
        const comment = post.comments.id(commentId)
        comment.rating += vote
        prevVote.vote = vote
        await Promise.all([post.save(), profile.save()])
        res.status(200).json(comment)
      }
    } else {
      const post = await Post.findById(postId, 'comments')
      const comment = post.comments.id(commentId)
      if (comment.author.equals(req.user.profile)) {
        res.status(401).json({ msg: 'You cannot vote for your own comment.' })
      } else {
        comment.rating += vote
        profile.votes.push({ vote: vote, commentId: commentId })
        await Promise.all([post.save(), profile.save()])
        res.status(200).json(comment)
      }
    }
  } catch (err) {
    res.status(500).json(err)
  }
}

const incrementViews = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id, 'views viewers author')
    if (post.viewers.includes(req.user.profile) || post.author.equals(req.user.profile)) {
      res.status(200).send('OK')
    } else {
      post.views = post.views + 1
      post.viewers.push(req.user.profile)
      await post.save()
      res.status(200).send('OK')
    }
  } catch (err) {
    console.log(err)
    res.status(500).json(err)
  }
}

const bookmarkPost = async (req, res) => {
  try {
    const profile = await Profile.findById(req.user.profile)
    if (profile.bookmarks.includes(req.params.id)) {
      res.status(401).json({ msg: 'Already bookmarked!' })
    } else {
      profile.bookmarks.push(req.params.id)
      profile.save()
      res.status(200).send('OK')
    }
  } catch (err) {
    res.status(500).json(err)
  }
}

const removeBookmark = async (req, res) => {
  try {
    const profile = await Profile.findById(req.user.profile)
    profile.bookmarks.remove({ _id: req.params.id })
    await profile.save()
    res.status(200).send('OK')
  } catch (err) {
    res.status(500).json(err)
  }
}

export {
  index,
  create,
  show,
  update,
  deletePost as delete,
  createComment,
  updateComment,
  deleteComment,
  castVote,
  incrementViews,
  bookmarkPost,
  removeBookmark
}