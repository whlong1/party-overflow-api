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
    const posts = await Post.find({})
      .populate('author')
      .sort({ createdAt: 'desc' })
    res.status(200).json(posts)
  } catch (err) {
    res.status(500).json(err)
  }
}

const show = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)
      .populate('author')
      .populate('comments.author')
    res.status(200).json(post)
  } catch (err) {
    res.status(500).json(err)
  }
}

const update = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)
    if (!post.author.equals(req.user.profile)) {
      throw new Error('Unauthorized')
      // res.status(401).json({ err: 'Unauthorized' })
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
      res.status(401).json({ err: 'Unauthorized' })
    } else {
      await Post.deleteOne({ _id: req.params.id })
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

    // Append profile data
    const profile = await Profile.findById(req.user.profile)
    newComment.author = profile

    return res.status(201).json(newComment)
  } catch (err) {
    res.status(500).json(err)
  }
}



const markCommentAsSolution = async (req, res) => {

}




export {
  index,
  create,
  show,
  update,
  deletePost as delete,

  createComment,
  markCommentAsSolution
}