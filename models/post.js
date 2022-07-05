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
  viewers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Profile' }],
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'Profile' },
  comments: [commentSchema]
}, { timestamps: true })


postSchema.statics.findByIdAndSortComments = (id, page, limit) => {
  return mongoose.model('Post').aggregate([
    { $match: { _id: mongoose.Types.ObjectId(id) } },
    {
      $lookup: {
        from: 'profiles',
        localField: 'author',
        foreignField: '_id',
        as: 'author'
      },
    },
    { $unwind: '$author' },
    { $lookup: { from: "profiles", localField: "comments.author", foreignField: "_id", as: "authors" } },
    {
      $addFields: {
        "comments.author._id": {
          $cond: [
            { $ne: ["$author", []] },
            { $arrayElemAt: ["$authors._id", 0] },
            "$comments.author",
          ],
        },
        "comments.author.name": {
          $cond: [
            { $ne: ["$author", []] },
            { $arrayElemAt: ["$authors.name", 0] },
            "$comments.author",
          ],
        },
        "comments.author.avatar": {
          $cond: [
            { $ne: ["$author", []] },
            { $arrayElemAt: ["$authors.avatar", 0] },
            "$comments.author",
          ],
        }
      }
    },
    {
      $project: {
        _id: 1,
        text: 1,
        codeblock: 1,
        resolved: 1,
        language: 1,
        views: 1,
        author: { _id: 1, name: 1, avatar: 1 },
        comments: { $slice: ["$comments", page, limit], },
      }
    },
    { $sort: { "comments.rating": 1 } },
  ])
}

const Post = mongoose.model('Post', postSchema)

export {
  Post
}