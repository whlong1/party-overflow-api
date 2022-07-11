import { Profile } from "../models/profile/profile.js"

const index = async (req, res) => {
  try {
    const profiles = await Profile.find({}, 'name avatar')
      .sort({ solution_count: -1 })
      .limit(10)
    res.status(200).json(profiles)
  } catch (err) {
    res.status(500).json(err)
  }
}

const show = async (req, res) => {
  try {
    const fields = 'email name avatar following followers solution_count.language'
    const profile = await Profile.findById(req.params.id, fields)
      .populate({
        limit: 8,
        path: 'posts',
        options: { sort: { 'views': -1 } },
        select: { '_id': 1, 'text': 1, 'views': 1, 'language': 1, 'resolved': 1 },
      })
      .populate({
        path: 'bookmarks.author',
        select: { '_id': 1, 'text': 1, 'views': 1, 'language': 1, 'resolved': 1 },
      })
    res.status(200).json(profile)
  } catch (err) {
    res.status(500).json(err)
  }
}

const follow = async (req, res) => {
  try {
    const follower = await Profile.findById(req.user.profile)
    const followee = await Profile.findById(req.params.id)
    follower.following.push(followee._id)
    followee.followers.push(follower._id)
    await Promise.all([follower.save(), followee.save()])
    res.status(200).json({ msg: `You are now following ${followee.name}.` })
  } catch (err) {
    res.status(500).json(err)
  }
}

const unfollow = async (req, res) => {
  try {
    const follower = await Profile.findById(req.user.profile)
    const followee = await Profile.findById(req.params.id)
    follower.following.remove(followee._id)
    followee.followers.remove(follower._id)
    await Promise.all([follower.save(), followee.save()])
    res.status(200).json({ msg: `You are no longer following ${followee.name}.` })
  } catch (err) {
    res.status(500).json(err)
  }
}

export {
  index,
  show,
  follow,
  unfollow
}