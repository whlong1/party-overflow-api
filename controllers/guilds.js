import { Guild } from "../models/guild/guild.js"
import { Profile } from "../models/profile/profile.js"

const index = async (req, res) => {
  try {

  } catch (err) {
    res.status(500).json(err)
  }
}


const show = async (req, res) => {
  try {

  } catch (err) {
    res.status(500).json(err)
  }
}

const create = async (req, res) => {
  try {
    const guild = await Guild.create(req.body)
    await Profile.updateOne(
      { _id: req.user.profile },
      { $push: { guilds: guild } }
    )
    res.status(201).json(guild)
  } catch (err) {
    res.status(500).json(err)
  }
}

const update = async (req, res) => {
  try {

  } catch (err) {
    res.status(500).json(err)
  }
}



export {
  index,
  show,
  create,
  update
}