import mongoose from 'mongoose'

const Schema = mongoose.Schema

const commentSchema = new Schema(
  {
    text: {
      type: String,
      required: true
    },
    codeblock: {
      type: String,
      required: false
    },
    solution: {
      type: Boolean,
      default: false
    },
    rating: {
      type: Number,
      default: 0
    },
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'Profile' }
  },
  { timestamps: true }
)

const postSchema = new Schema({
  text: {
    type: String,
    required: true
  },
  codeblock: {
    type: String,
    required: false
  },
  resolved: {
    type: Boolean,
    default: false
  },
  tag: {
    type: String,
    required: true,
    default: 'Javascript',
    enum: ['HTML', 'CSS', 'Javascript', 'Python']
  },
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'Profile' },
  comments: [commentSchema]
}, { timestamps: true })

const Post = mongoose.model('Post', postSchema)

export {
  Post
}