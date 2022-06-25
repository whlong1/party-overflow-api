import { Profile } from "../models/profile.js";

const index = async (req, res) => {
  try {
    const profiles = await Profile.find({})
      .sort({ solution_count: -1 })
      .limit(10)
    res.status(200).json(profiles)
  } catch (err) {
    res.status(500).json(err)
  }
}

export {
  index
}