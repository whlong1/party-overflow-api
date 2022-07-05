import mongoose from 'mongoose'

function findByIdAndSortComments(id, page, limit) {
  return this.aggregate([
    // Find post by _id:
    { $match: { _id: mongoose.Types.ObjectId(id) } },
    // Fill author field with associated profile
    { $lookup: { from: 'profiles', localField: 'author', foreignField: '_id', as: 'author' } },
    // Convert author field from array to single object:
    { $unwind: '$author' },
    // Find profiles associated with each comment:
    { $lookup: { from: "profiles", localField: "comments.author", foreignField: "_id", as: "authors" } },
    // Add _id, name, and avatar to author property of comment:
    {
      $addFields: {
        "comments.author._id": {
          $cond: [{ $ne: ["$author", []] }, { $arrayElemAt: ["$authors._id", 0] }, "$comments.author"]
        },
        "comments.author.name": {
          $cond: [{ $ne: ["$author", []] }, { $arrayElemAt: ["$authors.name", 0] }, "$comments.author"]
        },
        "comments.author.avatar": {
          $cond: [{ $ne: ["$author", []] }, { $arrayElemAt: ["$authors.avatar", 0] }, "$comments.author"]
        }
      }
    },
    // Clean up returned fields:
    {
      $project: {
        _id: 1,
        text: 1,
        codeblock: 1,
        resolved: 1,
        language: 1,
        views: 1,
        author: { _id: 1, name: 1, avatar: 1 },
        comments: { $slice: ["$comments", page, limit] }
      }
    },
    // Sort comments by rating:
    { $sort: { "comments.rating": 1 } },
  ])
}

export {
  findByIdAndSortComments
}