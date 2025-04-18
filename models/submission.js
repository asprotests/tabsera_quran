const mongoose = require("../config/mongo");

const submissionSchema = new mongoose.Schema(
  {
    studentId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    assignmentId: { type: mongoose.Schema.Types.ObjectId, ref: "Assignment" },
    files: [String], // stored filenames or paths
    ayah: String,
    feedback: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model("Submission", submissionSchema);
