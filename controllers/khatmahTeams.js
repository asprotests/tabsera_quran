const KhatmahTeam = require("../models/khatmahTeam");

exports.createKhatmahTeam = async (req, res) => {
  try {
    const { name, code, dailyTarget } = req.body;
    const creatorId = req.user.id;

    const exists = await KhatmahTeam.findOne({ code });
    if (exists) return res.status(400).json({ message: "Code already exists" });

    const team = await KhatmahTeam.create({
      name,
      code,
      dailyTarget,
      creatorId,
      members: [creatorId],
      progress: {},
    });

    res.status(201).json({ team });
  } catch (err) {
    res.status(500).json({ message: "Failed to create team" });
  }
};

exports.getAllMyKhatmahTeams = async (req, res) => {
  try {
    const teams = await KhatmahTeam.find({ members: req.user.id });
    res.json({ teams });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch teams" });
  }
};

exports.getKhatmahTeamById = async (req, res) => {
  try {
    const team = await KhatmahTeam.findById(req.params.id);
    if (!team) return res.status(404).json({ message: "Team not found" });

    res.json({ team });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch team" });
  }
};

exports.getKhatmahTeamByCode = async (req, res) => {
  try {
    const team = await KhatmahTeam.findOne({ code: req.params.code });
    if (!team) return res.status(404).json({ message: "Team not found" });

    res.json({ team });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch team by code" });
  }
};

exports.updateDailyTarget = async (req, res) => {
  try {
    const team = await KhatmahTeam.findByIdAndUpdate(
      req.params.id,
      { dailyTarget: req.body.dailyTarget },
      { new: true }
    );

    if (!team) return res.status(404).json({ message: "Team not found" });
    res.json({ message: "Updated daily target", team });
  } catch (err) {
    res.status(500).json({ message: "Failed to update" });
  }
};

exports.deleteKhatmahTeam = async (req, res) => {
  try {
    const team = await KhatmahTeam.findByIdAndDelete(req.params.id);
    if (!team) return res.status(404).json({ message: "Team not found" });

    res.json({ message: "Team deleted" });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete" });
  }
};

exports.removeTeamMember = async (req, res) => {
  try {
    const { code, id } = req.params;

    const team = await KhatmahTeam.findOne({ code });
    if (!team) return res.status(404).json({ message: "Team not found" });

    team.members = team.members.filter((m) => m.toString() !== id);
    await team.save();

    res.json({ message: "Member removed" });
  } catch (err) {
    res.status(500).json({ message: "Failed to remove member" });
  }
};

exports.joinKhatmahTeam = async (req, res) => {
  try {
    const team = await KhatmahTeam.findOne({ code: req.params.code });
    if (!team) return res.status(404).json({ message: "Team not found" });

    if (!team.members.includes(req.user.id)) {
      team.members.push(req.user.id);
      await team.save();
    }

    res.json({ message: "Joined team", team });
  } catch (err) {
    res.status(500).json({ message: "Join failed" });
  }
};

exports.leaveKhatmahTeam = async (req, res) => {
  try {
    const team = await KhatmahTeam.findOne({ code: req.params.code });
    if (!team) return res.status(404).json({ message: "Team not found" });

    team.members = team.members.filter((m) => m.toString() !== req.user.id);
    await team.save();

    res.json({ message: "Left team" });
  } catch (err) {
    res.status(500).json({ message: "Leave failed" });
  }
};

exports.updateMemberProgress = async (req, res) => {
  try {
    const { code } = req.params;
    const { progress } = req.body;

    const team = await KhatmahTeam.findOne({ code });
    if (!team) return res.status(404).json({ message: "Team not found" });

    team.progress = {
      ...team.progress,
      [req.user.id]: progress,
    };

    await team.save();

    res.json({ message: "Progress updated" });
  } catch (err) {
    res.status(500).json({ message: "Progress update failed" });
  }
};
