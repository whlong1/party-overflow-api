import mongoose from 'mongoose'

function findGuild(id) {
  return this.aggregate([
    { $match: { _id: mongoose.Types.ObjectId(id) } },
  ])
}


export {
  findGuild
}