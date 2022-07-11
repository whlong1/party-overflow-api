import mongoose from 'mongoose'

function findByIdAndSortComments(id, page, limit) {
  return this.aggregate([
    // Find post by _id:
    { $match: { _id: mongoose.Types.ObjectId(id) } },
    // Fill author field with associated profile
    { $lookup: { from: 'profiles', localField: 'author', foreignField: '_id', as: 'author' } },
    // Convert author field from array to single object:
    { $unwind: '$author' },
    // Deconstruct comment array:
    { $unwind: { path: "$comments", preserveNullAndEmptyArrays: true } },
    // Find profiles associated with each comment:
    {
      $lookup: {
        from: "profiles",
        let: { authorId: "$comments.author" },
        pipeline: [{ $match: { $expr: { $eq: ['$_id', '$$authorId'] } } }, { $project: { _id: 1, name: 1, avatar: 1 } }],
        as: 'comments.author',
      }
    },
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
        comments: {
          $push: {
            _id: "$comments._id",
            text: "$comments.text",
            codeblock: "$comments.codeblock",
            solution: "$comments.solution",
            rating: "$comments.rating",
            author: { $first: "$comments.author" },
          },
        },
      }
    },
    // Find existing solution:
    { $addFields: { solution: { $filter: { input: "$comments", as: "comment", cond: { $eq: ["$$comment.solution", true] } } } } },
    // Sort comments by rating:
    { $unwind: { path: "$comments", preserveNullAndEmptyArrays: true } },
    { $sort: { "comments.rating": -1 } },
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
    // Remove existing solution from comments array:
    { $addFields: { comments: { $filter: { input: "$comments", as: "comment", cond: { $ne: ["$$comment.solution", true] } } } } },
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

function findPosts(search, page, limit) {
  return this.aggregate([
    { $match: { _id: mongoose.Types.ObjectId(id) } },
    { $lookup: { from: 'profiles', localField: 'author', foreignField: '_id', as: 'author' } },
    { $unwind: '$author' },
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
        // comments: { $push: "$comments" },
      }
    },
  ])
}

export {
  findPosts,
  findByIdAndSortComments,
}