const mongoose = require("../config/mongo");

const khatmahTeamSchema = new mongoose.Schema(
  {
    name: String,
    code: { type: String, unique: true },
    dailyTarget: Number,
    creatorId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    members: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    progress: Object, // { userId: { completed: true, ayah: '...' } }
  },
  { timestamps: true }
);

module.exports = mongoose.model("KhatmahTeam", khatmahTeamSchema);
