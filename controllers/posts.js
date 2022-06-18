import { Profile } from "../models/profile.js";
import { Post } from "../models/post.js";



const create = async (req, res) => {
  try {
    req.body.author = req.user.profile
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
      .populate('added_by')
      .sort({ createdAt: 'desc' })
    return res.status(200).json(posts)
  } catch (err) {
    return res.status(500).json(err)
  }
}


export {
  index,
  create
}