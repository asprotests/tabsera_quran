// Shared in-memory course + enrollment data
const enrollments = [];
const courses = [
  { id: 1, title: "Tajweed Level 1" },
  { id: 2, title: "Hifdh Juz Amma" },
];

exports.enrollToTabseraQuranCourse = (req, res) => {
  const studentId = req.user.id;
  const courseId = parseInt(req.params.id);

  const alreadyEnrolled = enrollments.some(
    (e) => e.studentId === studentId && e.courseId === courseId
  );
  if (alreadyEnrolled) {
    return res.status(400).json({ message: "Already enrolled" });
  }

  enrollments.push({ id: Date.now(), studentId, courseId, status: "active" });
  res.json({ message: "Enrolled successfully" });
};

exports.terminateEnrollment = (req, res) => {
  const studentId = req.user.id;
  const courseId = parseInt(req.params.id);

  const enrollment = enrollments.find(
    (e) => e.studentId === studentId && e.courseId === courseId
  );
  if (!enrollment)
    return res.status(404).json({ message: "Enrollment not found" });

  enrollment.status = "completed";
  res.json({ message: "Enrollment marked as completed" });
};

exports.revokeTabseraQuranEnrollment = (req, res) => {
  const courseId = parseInt(req.params.id);
  const index = enrollments.findIndex((e) => e.courseId === courseId);

  if (index === -1)
    return res.status(404).json({ message: "Enrollment not found" });

  enrollments.splice(index, 1);
  res.json({ message: "Enrollment revoked" });
};
