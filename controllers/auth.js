import { User } from '../models/user.js'
import { Profile } from '../models/profile.js'
import jwt from 'jsonwebtoken'

const signup = async (req, res) => {
  try {
    const profile = await Profile.findOne({ email: req.body.email })
    if (profile) {
      throw new Error('Account already exists')
    } else if (!process.env.SECRET) {
      throw new Error('no SECRET in .env file')
    } else {
      var newProfile = await Profile.create(req.body)
      req.body.profile = newProfile._id
      const user = await User.create(req.body)
      const token = createJWT(user)
      res.status(200).json({ token })
    }
  } catch (err) {
    if (err.name === 'ValidationError') {
      await Profile.findByIdAndDelete(newProfile._id)
      res.status(500).json({ err: err.message })
    } else {
      res.status(500).json({ err: err.message })
    }
  }
}


function login(req, res) {
  User.findOne({ email: req.body.email })
    .then(user => {
      if (!user) return res.status(401).json({ err: 'User not found' })
      user.comparePassword(req.body.pw, (err, isMatch) => {
        if (isMatch) {
          const token = createJWT(user)
          res.json({ token })
        } else {
          res.status(401).json({ err: 'Incorrect password' })
        }
      })
    })
    .catch(err => {
      res.status(500).json(err)
    })
}

function createJWT(user) {
  return jwt.sign(
    { user },
    process.env.SECRET,
    { expiresIn: '24h' }
  )
}

export {
  signup,
  login
}
