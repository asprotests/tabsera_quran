const assignments = [
  { id: 1, courseId: 1, title: "Recite Surah Al-Fatiha", isLocked: false },
  { id: 2, courseId: 2, title: "Recite Ayahs 1–10", isLocked: false },
];

const submissions = [];

exports.addStudentAssignmentSubmissionForTabseraQuran = (req, res) => {
  const { assignmentId, ayah } = req.body;
  const studentId = req.user.id;

  submissions.push({
    id: Date.now(),
    studentId,
    assignmentId,
    files: req.files || [],
    ayah,
    submittedAt: new Date(),
  });

  res.status(201).json({ message: "Assignment submitted" });
};

exports.resubmitAssignmentForTabseraQuran = (req, res) => {
  const { assignmentId } = req.body;
  const studentId = req.user.id;

  const submission = submissions.find(
    (s) => s.assignmentId === assignmentId && s.studentId === studentId
  );

  if (!submission) {
    return res.status(404).json({ message: "No original submission found" });
  }

  submission.files = req.files || [];
  submission.resubmittedAt = new Date();

  res.json({ message: "Assignment resubmitted" });
};

exports.lockAssignmentForTabseraQuran = (req, res) => {
  const assignment = assignments.find((a) => a.id === parseInt(req.params.id));
  if (!assignment)
    return res.status(404).json({ message: "Assignment not found" });

  assignment.isLocked = true;
  res.json({ message: "Assignment locked" });
};

exports.unlockAssignmentForTabseraQuran = (req, res) => {
  const assignment = assignments.find((a) => a.id === parseInt(req.params.id));
  if (!assignment)
    return res.status(404).json({ message: "Assignment not found" });

  assignment.isLocked = false;
  res.json({ message: "Assignment unlocked" });
};

exports.giveFeedbackOnTabseraQuranAssignmentSubmission = (req, res) => {
  const { assignmentId, feedback } = req.body;
  const submission = submissions.find((s) => s.assignmentId === assignmentId);

  if (!submission)
    return res.status(404).json({ message: "Submission not found" });

  submission.feedback = feedback;
  res.json({ message: "Feedback recorded" });
};

exports.getLastAssignmentEndingAyahForTabseraQuran = (req, res) => {
  const studentId = req.user.id;
  const studentSubs = submissions
    .filter((s) => s.studentId === studentId)
    .sort((a, b) => b.submittedAt - a.submittedAt);

  if (studentSubs.length === 0) return res.json({ ayah: null });

  res.json({ ayah: studentSubs[0].ayah || "Ayah not specified" });
};

exports.getAssignmentsByUserIdForTabseraQuran = (req, res) => {
  const userId = req.user.id;
  const mySubs = submissions.filter((s) => s.studentId === userId);
  res.json({ submissions: mySubs });
};
