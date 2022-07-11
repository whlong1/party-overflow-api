import mongoose from 'mongoose'

const voteSchema = new mongoose.Schema({
  vote: { type: Number, max: 1, min: -1, default: 1 },
  commentId: { type: String, required: true }
})

const solutionSchema = new mongoose.Schema({
  language: { type: String, required: true },
  post: { type: mongoose.Schema.Types.ObjectId, ref: 'Post', required: true },
})

const profileSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    lowercase: true,
    unique: true
  },
  name: {
    type: String,
    required: true,
  },
  avatar: {
    type: String,
    required: true
  },
  votes: [voteSchema],
  solution_count: [solutionSchema],
  posts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Post' }],
  bookmarks: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Post' }],
  following: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Profile' }],
  followers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Profile' }]
}, {
  timestamps: true,
})

const Profile = mongoose.model('Profile', profileSchema)

export { Profile }
