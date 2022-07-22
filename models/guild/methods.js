import mongoose from 'mongoose'

function findWithLinkedData(id) {
  return this.aggregate([
    { $match: { _id: mongoose.Types.ObjectId(id) } },
    { $lookup: { from: 'profiles', localField: 'members', foreignField: '_id', as: 'm' } },
    { $lookup: { from: 'profiles', localField: 'waitlist', foreignField: '_id', as: 'w' } },
    { $lookup: { from: 'profiles', localField: 'administrators', foreignField: '_id', as: 'a' } },

    { $unwind: { path: "$m", preserveNullAndEmptyArrays: true } },
    { $unwind: { path: "$w", preserveNullAndEmptyArrays: true } },
    { $unwind: { path: "$a", preserveNullAndEmptyArrays: true } },

    {
      $group: {
        _id: "$_id",
        name: { $first: "$name" },
        banner: { $first: "$banner" },
        public: { $first: "$public" },
        members: { $push: { _id: "$m._id", name: "$m.name", avatar: "$m.avatar" } },
        waitlist: { $push: { _id: "$w._id", name: "$w.name", avatar: "$w.avatar" } },
        administrators: { $push: { _id: "$a._id", name: "$a.name", avatar: "$a.avatar" } },

        collectiveScore: { $sum: "$members.solution_count" },
      }
    },
  ])
}

export {
  findWithLinkedData
}
