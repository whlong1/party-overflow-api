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

    // Find existing solution:
    { $addFields: { solution: { $filter: { input: "$comments", as: "comment", cond: { $eq: ["$$comment.solution", true] } } } } },
    // Remove existing solution from comments array:
    { $addFields: { comments: { $filter: { input: "$comments", as: "comment", cond: { $ne: ["$$comment.solution", true] } } } } },

    // Sort comments by rating:
    { $unwind: "$comments" }, { $sort: { "comments.rating": -1 } },

    // Group new object:
    {
      $group: {
        _id: "$_id",
        text: { $first: "$text" },
        codeblock: { $first: "$codeblock" },
        resolved: { $first: "$resolved" },
        language: { $first: "$language" },
        views: { $first: "$views" },
        author: { $first: "$author" },
        solution: { $first: "$solution" },
        comments: { $push: "$comments" },
      }
    },

    // Clean up returned fields and apply comment pagination:
    {
      $project: {
        _id: 1,
        text: 1,
        codeblock: 1,
        resolved: 1,
        language: 1,
        views: 1,
        author: { _id: 1, name: 1, avatar: 1 },
        solution: { $first: "$solution" },
        comments: { $slice: ["$comments", page, limit] },
      }
    },
  ])
}

export {
  findByIdAndSortComments
}
