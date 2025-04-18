const Assignment = require("../models/assignment");
const Submission = require("../models/submission");

exports.addStudentAssignmentSubmissionForTabseraQuran = async (req, res) => {
  try {
    const { assignmentId, ayah } = req.body;
    const studentId = req.user.id;

    const files = req.files?.map((f) => f.originalname) || [];

    await Submission.create({
      studentId,
      assignmentId,
      files,
      ayah,
    });

    res.status(201).json({ message: "Assignment submitted" });
  } catch (err) {
    res.status(500).json({ message: "Failed to submit assignment" });
  }
};

exports.resubmitAssignmentForTabseraQuran = async (req, res) => {
  try {
    const { assignmentId } = req.body;
    const studentId = req.user.id;

    const submission = await Submission.findOne({ assignmentId, studentId });
    if (!submission) {
      return res.status(404).json({ message: "Original submission not found" });
    }

    submission.files = req.files?.map((f) => f.originalname) || [];
    submission.updatedAt = new Date();
    await submission.save();

    res.json({ message: "Resubmission successful" });
  } catch (err) {
    res.status(500).json({ message: "Resubmission failed" });
  }
};

exports.lockAssignmentForTabseraQuran = async (req, res) => {
  try {
    const assignment = await Assignment.findByIdAndUpdate(
      req.params.id,
      { isLocked: true },
      { new: true }
    );
    if (!assignment)
      return res.status(404).json({ message: "Assignment not found" });

    res.json({ message: "Assignment locked" });
  } catch (err) {
    res.status(500).json({ message: "Locking failed" });
  }
};

exports.unlockAssignmentForTabseraQuran = async (req, res) => {
  try {
    const assignment = await Assignment.findByIdAndUpdate(
      req.params.id,
      { isLocked: false },
      { new: true }
    );
    if (!assignment)
      return res.status(404).json({ message: "Assignment not found" });

    res.json({ message: "Assignment unlocked" });
  } catch (err) {
    res.status(500).json({ message: "Unlocking failed" });
  }
};

exports.giveFeedbackOnTabseraQuranAssignmentSubmission = async (req, res) => {
  try {
    const { assignmentId, feedback } = req.body;

    const submission = await Submission.findOne({ assignmentId });
    if (!submission)
      return res.status(404).json({ message: "Submission not found" });

    submission.feedback = feedback;
    await submission.save();

    res.json({ message: "Feedback saved" });
  } catch (err) {
    res.status(500).json({ message: "Feedback failed" });
  }
};

exports.getLastAssignmentEndingAyahForTabseraQuran = async (req, res) => {
  try {
    const studentId = req.user.id;

    const last = await Submission.find({ studentId })
      .sort({ createdAt: -1 })
      .limit(1);

    if (last.length === 0) {
      return res.json({ ayah: null });
    }

    res.json({ ayah: last[0].ayah || "Not specified" });
  } catch (err) {
    res.status(500).json({ message: "Failed to get last ayah" });
  }
};

exports.getAssignmentsByUserIdForTabseraQuran = async (req, res) => {
  try {
    const submissions = await Submission.find({ studentId: req.user.id });
    res.json({ submissions });
  } catch (err) {
    res.status(500).json({ message: "Failed to get assignments" });
  }
};
