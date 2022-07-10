import mongoose from 'mongoose'

const voteSchema = new mongoose.Schema({
  vote: {
    type: Number,
    max: 1,
    min: -1,
    default: 1
  },
  commentId: {
    type: String,
    required: true,
  }
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
  solution_count: {
    type: Number,
    required: false,
    default: 0,
  },
  votes: [voteSchema],
  posts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Post' }],
  bookmarks: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Post' }],
  following: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Profile' }],
  followers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Profile' }]
}, {
  timestamps: true,
})

const Profile = mongoose.model('Profile', profileSchema)

export { Profile }
