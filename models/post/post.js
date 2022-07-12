import mongoose from 'mongoose'
import * as postSchemaMethods from './methods.js'

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
  language: {
    type: String,
    required: true,
    default: 'Javascript',
    enum: ['HTML', 'CSS', 'Javascript', 'Python']
  },
  views: {
    type: Number,
    default: 0
  },
  comments: [commentSchema],
  viewers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Profile' }],
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'Profile', required: true }
},
  { timestamps: true }
)

postSchema.statics = postSchemaMethods
const Post = mongoose.model('Post', postSchema)

export {
  Post
}