import mongoose from 'mongoose'

const voteSchema = new mongoose.Schema({
  vote: {
    type: Boolean,
    default: true
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
  bookmarks: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Post' }]
}, {
  timestamps: true,
})

const Profile = mongoose.model('Profile', profileSchema)

export { Profile }
