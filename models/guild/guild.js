import mongoose from 'mongoose'
import * as guildSchemaMethods from './methods.js'

const Schema = mongoose.Schema

const guildSchema = new Schema({
  name: { type: String, required: true },
  banner: { type: String, required: true },
  public: { type: Boolean, default: false },
  members: [{ type: mongoose.Types.ObjectId, ref: 'Profile' }],
  waitlist: [{ type: mongoose.Types.ObjectId, ref: 'Profile' }],
  administrators: [{ type: mongoose.Types.ObjectId, ref: 'Profile' }],
},
  { timestamps: true }
)

guildSchema.statics = guildSchemaMethods
const Guild = mongoose.model('Guild', guildSchema)

export {
  Guild
}