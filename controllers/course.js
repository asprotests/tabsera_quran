const Course = require("../models/course");
const Enrollment = require("../models/enrollment");

exports.getTabseraQuranCourses = async (req, res) => {
  try {
    const courses = await Course.find({ isActive: true });
    res.json({ courses });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch courses" });
  }
};

exports.getTabseraQuranStudentCourses = async (req, res) => {
  try {
    const studentId = req.user.id;
    const { type, page, limit, sort, sortDirection } = req.query;

    const enrollments = await Enrollment.find({
      student: studentId,
      status: type,
    })
      .populate("course")
      .sort({ [sort]: sortDirection })
      .skip(page * limit)
      .limit(limit);

    const courses = enrollments.map((e) => e.course);

    res.status(200).json({ courses });
  } catch (err) {
    console.error("Error fetching student courses:", err);
    res.status(500).json({ message: "Failed to retrieve student courses" });
  }
};

exports.getCoursesCompletedByStudentOfTabseraQuran = async (req, res) => {
  try {
    const studentId = req.user.id;
    const enrollments = await Enrollment.find({
      studentId,
      status: "completed",
    }).populate("courseId");

    const completedCourses = enrollments.map((e) => e.courseId);
    res.json({ courses: completedCourses });
  } catch (err) {
    res.status(500).json({ message: "Failed to load completed courses" });
  }
};
