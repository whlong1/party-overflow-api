import mongoose from 'mongoose'

const Schema = mongoose.Schema

const commentSchema = new Schema(
  {
    comment_text: {
      type: String,
      required: true
    },
    codeblock: {
      type: String,
      required: false
    },
    is_solution: {
      type: Boolean,
      default: false
    },
    commenter: { type: mongoose.Schema.Types.ObjectId, ref: 'Profile' }
  },
  { timestamps: true }
)

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
  comments: [commentSchema]
}, { timestamps: true })



const Post = mongoose.model('Post', postSchema)

export {
  Post
}