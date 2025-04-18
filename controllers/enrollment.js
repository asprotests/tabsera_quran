const Enrollment = require("../models/enrollment");
const Course = require("../models/course");

exports.enrollToTabseraQuranCourse = async (req, res) => {
  try {
    const studentId = req.user.id;
    const courseId = req.params.id;

    const course = await Course.findById(courseId);
    if (!course) return res.status(404).json({ message: "Course not found" });

    const existing = await Enrollment.findOne({ studentId, courseId });
    if (existing) {
      return res.status(400).json({ message: "Already enrolled" });
    }

    const alreadyEnrolled = await Enrollment.findOne({
      student: studentId,
      status: "active",
    });

    if (alreadyEnrolled) {
      return res.status(400).json({
        message:
          "You are already enrolled in another course. Please complete or revoke it before enrolling again.",
      });
    }

    await Enrollment.create({ studentId, courseId });
    res.json({ message: "Enrolled successfully" });
  } catch (err) {
    res.status(500).json({ message: "Failed to enroll" });
  }
};

exports.terminateEnrollment = async (req, res) => {
  try {
    const studentId = req.user.id;
    const courseId = req.params.id;

    const enrollment = await Enrollment.findOne({
      student: studentId,
      course: courseId,
      status: "active", // or 'accepted'
    });

    if (!enrollment) {
      return res
        .status(404)
        .json({ message: "Enrollment not found or not active" });
    }

    enrollment.status = "completed";
    enrollment.completedAt = new Date();
    await enrollment.save();

    res.status(200).json({ message: "Course marked as completed" });
  } catch (err) {
    console.error("Complete error:", err);
    res.status(500).json({ message: "Failed to complete course" });
  }
};

exports.revokeTabseraQuranEnrollment = async (req, res) => {
  try {
    const courseId = req.params.id;

    const deleted = await Enrollment.findOneAndDelete({ courseId });
    if (!deleted)
      return res.status(404).json({ message: "Enrollment not found" });

    res.json({ message: "Enrollment revoked" });
  } catch (err) {
    res.status(500).json({ message: "Failed to revoke enrollment" });
  }
};
