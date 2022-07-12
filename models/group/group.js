import mongoose from 'mongoose'
import * as groupSchemaMethods from './methods.js'

const Schema = mongoose.Schema

const groupSchema = new Schema({
  name: { type: String, required: true },
  banner: { type: String, required: true },
  public: { type: Boolean, default: false },
  blogs: [{ type: mongoose.Types.ObjectId, ref: 'Blog' }],
  members: [{ type: mongoose.Types.ObjectId, ref: 'Profile' }],
  waitlist: [{ type: mongoose.Types.ObjectId, ref: 'Profile' }],
  administrators: [{ type: mongoose.Types.ObjectId, ref: 'Profile' }],
},
  { timestamps: true }
)


groupSchema.statics = groupSchemaMethods
const Group = mongoose.model('Group', groupSchema)

export {
  Group
}