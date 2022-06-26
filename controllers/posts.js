import { Profile } from "../models/profile.js"
import { Post } from "../models/post.js"

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
    const { search, page, limit, sort } = req.query
    const fields = 'text codeblock solution author'
    const filter = { text: { $regex: search, $options: 'i' } }
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
    const limit = 3
    const page = req.query.page ? req.query.page : 0
    const post = await Post.findById(req.params.id, { comments: { $slice: [page, limit] } })
      .populate('author', 'name avatar')
      .populate('comments.author', 'name avatar')
    res.status(200).json(post)
  } catch (err) {
    res.status(500).json(err)
  }
}

const update = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id)
    if (!post.author.equals(req.user.profile)) {
      return next({ message: 'Unauthorized', status: 401 })
    } else {
      post.resolved = true
      await post.save()
      res.status(200).json(post)
    }
  } catch (err) {
    res.status(500).json(err)
  }
}

const deletePost = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id)
    if (!post.author.equals(req.user.profile)) {
      return next({ message: 'Unauthorized', status: 401 })
    } else {
      await post.delete()
      const profile = await Profile.findById(req.user.profile)
      profile.posts.remove({ _id: req.params.id })
      await profile.save()
    }
    res.status(200).send('OK')
  } catch (err) {
    res.status(500).json(err)
  }
}

const createComment = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)
    post.comments.push(req.body)
    await post.save()
    const newComment = post.comments[post.comments.length - 1]
    const profile = await Profile.findById(req.user.profile)
    newComment.author = profile
    res.status(201).json(newComment)
  } catch (err) {
    res.status(500).json(err)
  }
}

const updateComment = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.postId)
      .populate('added_by').populate('comments.commenter')
    const comment = post.comments.id(req.params.commentId)
    if (!comment.author.equals(req.user.profile)) {
      return next({ message: 'Unauthorized', status: 401 })
    } else {
      await Profile.updateOne(
        { _id: req.user.profile },
        { $inc: { solution_count: 1 } }
      )
      post.is_resolved = true
      comment.is_solution = true

      await post.save()
      res.status(200).json(post)
    }
  } catch (err) {
    res.status(500).json(err)
  }
}

const deleteComment = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.postId)
    const comment = post.comments.id(req.params.commentId)
    if (!comment.author.equals(req.user.profile)) {
      return next({ message: 'Unauthorized', status: 401 })
    } else {
      post.comments.remove({ _id: req.params.commentId })
      await post.save()
      res.status(200).send('OK')
    }
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
  deleteComment
}