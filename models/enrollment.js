const mongoose = require("../config/mongo");

const enrollmentSchema = new mongoose.Schema(
  {
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    courseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: true,
    },
    status: { type: String, enum: ["active", "completed"], default: "active" },
    completedAt: { type: Date },
  },

  { timestamps: true }
);

module.exports = mongoose.model("Enrollment", enrollmentSchema);
