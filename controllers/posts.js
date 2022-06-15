import { Profile } from "../models/profile.js";
import { Post } from "../models/post.js";


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
}