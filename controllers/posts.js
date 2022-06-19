import { Profile } from "../models/profile.js"
import { Post } from "../models/post.js"

const create = async (req, res) => {
  try {
    const post = await Post.create(req.body)
    await Profile.updateOne(
      { _id: req.user.profile },
      { $push: { posts: post } }
    )
    return res.status(201).json(post)
  } catch (err) {
    return res.status(500).json(err)
  }
}

const index = async (req, res) => {
  try {
    const posts = await Post.find({})
      .populate('author')
      .sort({ createdAt: 'desc' })
    return res.status(200).json(posts)
  } catch (err) {
    return res.status(500).json(err)
  }
}

const show = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)
      .populate('author')
      .populate('comments.author')
    return res.status(200).json(post)
  } catch (err) {
    return res.status(500).json(err)
  }
}


const update = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)
    if (post.author.equals(req.user.profile)) {
      post.resolved = true
      await post.save()
      return res.status(200).json(post)
    } else {
      return res.status(401).json({ err: 'Unauthorized' })
    }
  } catch (err) {
    return res.status(500).json(err)
  }
}

export {
  index,
  create,
  show,
  update
}