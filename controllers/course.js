const courses = [
  { id: 1, title: "Tajweed Level 1", teacherId: 100, isActive: true },
  { id: 2, title: "Hifdh Juz Amma", teacherId: 101, isActive: true },
];

const enrollments = [
  // This will be managed in enrollment controller
];

exports.getTabseraQuranCourses = (req, res) => {
  // Return all courses based on user role
  res.json({ courses });
};

exports.getTabseraQuranStudentCourses = (req, res) => {
  const studentId = req.user.id;
  const myCourses = enrollments
    .filter((e) => e.studentId === studentId)
    .map((e) => courses.find((c) => c.id === e.courseId));
  res.json({ courses: myCourses });
};

exports.getCoursesCompletedByStudentOfTabseraQuran = (req, res) => {
  const studentId = req.user.id;
  const completed = enrollments
    .filter((e) => e.studentId === studentId && e.status === "completed")
    .map((e) => courses.find((c) => c.id === e.courseId));
  res.json({ courses: completed });
};
