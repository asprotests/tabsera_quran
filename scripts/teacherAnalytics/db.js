db.assignmentpassdatas
  .aggregate([
    {
      $match: {
        teacher: ObjectId("670245a8975a285ae59ebc6e"),
        updatedAt: {
          $gte: ISODate("2025-04-01T00:00:00.000Z"),
          $lte: new Date(),
        },
        attachments: { $exists: true, $ne: [] },
      },
    },
    {
      $project: {
        _id: 0,
        path: {
          $arrayElemAt: ["$attachments.path", -1],
        },
      },
    },
  ])
  .forEach(function (doc) {
    print(doc.path);
  });

db.assignmentpassdatas.find({
  teacher: ObjectId("670245a8975a285ae59ebc6e"),
  feedbackFiles: {
    $elemMatch: {
      createdAt: {
        $gte: ISODate("2025-04-01T00:00:00.000Z"),
        $lte: new Date(),
      },
    },
  },
});

db.assignmentpassdatas.aggregate([
  {
    $match: {
      teacher: ObjectId("670245a8975a285ae59ebc6e"),
      feedbackFiles: { $exists: true, $ne: [] },
    },
  },
  { $unwind: "$feedbackFiles" },
  { $sort: { "feedbackFiles.createdAt": -1 } },
  { $limit: 3 },
  {
    $replaceRoot: {
      newRoot: "$feedbackFiles",
    },
  },
]);

db.users.findOne({ _id: ObjectId("670245a8975a285ae59ebc6e") });

db.assignmentpassdatas.aggregate([
  {
    $match: {
      teacher: ObjectId("670245a8975a285ae59ebc6e"),
      updatedAt: {
        $gte: ISODate("2025-04-01T00:00:00.000Z"),
        $lte: new Date(),
      },
      attachments: { $exists: true, $ne: [] },
    },
  },
  {
    $project: {
      _id: 0,
      path: {
        $arrayElemAt: ["$attachments.path", -1],
      },
    },
  },
]);

db.assignmentpassdatas.aggregate([
  {
    $match: {
      teacher: ObjectId("670245a8975a285ae59ebc6e"),
      updatedAt: {
        $gte: ISODate("2025-04-01T00:00:00.000Z"),
        $lte: new Date(),
      },
      attachments: { $exists: true, $ne: [] },
    },
  },
  {
    $project: {
      _id: 0,
      path: {
        $arrayElemAt: ["$attachments.path", -1],
      },
    },
  },
  { $count: "totalDocs" },
]);
