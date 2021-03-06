import { Guild } from "../models/guild/guild.js"
import { Profile } from "../models/profile/profile.js"

const index = async (req, res) => {
  try {
    const { search, page, sort } = req.query
    const fields = 'name banner members public'
    const limit = req.query.limit ? req.query.limit : 10
    const filter = { name: { $regex: search, $options: 'i' } }
    const order = { recent: { createdAt: 'desc' }, popular: { members: 'desc' } }
    const guilds = await Guild.find(search ? filter : {}, fields)
      .limit(limit)
      .skip(parseInt(page) * limit)
      .sort(sort ? order[sort] : order.recent)
      .populate('administrators', 'name avatar', { options: { limit: 1 } })
    res.status(200).json(guilds)
  } catch (err) {
    res.status(500).json(err)
  }
}

const show = async (req, res) => {
  try {
    const guild = await Guild.findWithLinkedData(req.params.id)
    res.status(200).json(guild)
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
    const guild = await Guild.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    )
    res.status(200).json(guild)
  } catch (err) {
    res.status(500).json(err)
  }
}

const requestMembership = async (req, res) => {
  try {
    await Guild.updateOne(
      { _id: req.params.id },
      { $push: { waitlist: req.user.profile } }
    )
    res.status(200).send('OK')
  } catch (err) {
    res.status(500).json(err)
  }
}

const approveMembership = async (req, res) => {
  try {
    await Guild.updateOne(
      { _id: req.params.id },
      { $push: { members: req.params.profileId } }
    )
    res.status(200).send('OK')
  } catch (err) {
    res.status(500).json(err)
  }
}

const denyMembership = async (req, res) => {
  try {
    await Guild.updateOne(
      { _id: req.params.id },
      { $pull: { waitlist: req.params.profileId } }
    )
    res.status(200).send('OK')
  } catch (err) {
    res.status(500).json(err)
  }
}

const addAdmin = async (req, res) => {
  try {
    await Guild.updateOne(
      { _id: req.params.id },
      { $push: { administrators: req.params.profileId } }
    )
    res.status(200).send('OK')
  } catch (err) {
    res.status(500).json(err)
  }
}

export {
  index,
  show,
  create,
  update,
  requestMembership,
  approveMembership,
  denyMembership,
  addAdmin
}