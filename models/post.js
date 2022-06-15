import mongoose from 'mongoose'

const Schema = mongoose.Schema

const postSchema = new Schema({
  question: {
    type: String,
    required: true
  },
  codeblock: {
    type: String,
    required: false
  },
  is_resolved: {
    type: Boolean,
    default: false
  },
  added_by: { type: mongoose.Schema.Types.ObjectId, ref: 'Profile' },
}, { timestamps: true })



const Post = mongoose.model('Post', postSchema)

export {
  Post
}