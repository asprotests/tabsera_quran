const khatmahTeams = [];

exports.createKhatmahTeam = (req, res) => {
  const { name, code, dailyTarget } = req.body;
  const userId = req.user.id;

  if (khatmahTeams.find((t) => t.code === code)) {
    return res.status(400).json({ message: "Code already in use" });
  }

  const team = {
    id: Date.now(),
    name,
    code,
    dailyTarget,
    creatorId: userId,
    members: [userId],
    progress: {},
  };

  khatmahTeams.push(team);
  res.status(201).json({ message: "Team created", team });
};

exports.getAllMyKhatmahTeams = (req, res) => {
  const userId = req.user.id;
  const myTeams = khatmahTeams.filter((t) => t.members.includes(userId));
  res.json({ teams: myTeams });
};

exports.getKhatmahTeamById = (req, res) => {
  const team = khatmahTeams.find((t) => t.id === parseInt(req.params.id));
  if (!team) return res.status(404).json({ message: "Team not found" });
  res.json({ team });
};

exports.getKhatmahTeamByCode = (req, res) => {
  const team = khatmahTeams.find((t) => t.code === req.params.code);
  if (!team) return res.status(404).json({ message: "Team not found" });
  res.json({ team });
};

exports.updateDailyTarget = (req, res) => {
  const team = khatmahTeams.find((t) => t.id === parseInt(req.params.id));
  if (!team) return res.status(404).json({ message: "Team not found" });

  team.dailyTarget = req.body.dailyTarget;
  res.json({ message: "Daily target updated" });
};

exports.deleteKhatmahTeam = (req, res) => {
  const index = khatmahTeams.findIndex((t) => t.id === parseInt(req.params.id));
  if (index === -1) return res.status(404).json({ message: "Team not found" });

  khatmahTeams.splice(index, 1);
  res.json({ message: "Team deleted" });
};

exports.removeTeamMember = (req, res) => {
  const team = khatmahTeams.find((t) => t.code === req.params.code);
  if (!team) return res.status(404).json({ message: "Team not found" });

  const memberId = parseInt(req.params.id);
  team.members = team.members.filter((id) => id !== memberId);
  res.json({ message: "Member removed" });
};

exports.joinKhatmahTeam = (req, res) => {
  const team = khatmahTeams.find((t) => t.code === req.params.code);
  if (!team) return res.status(404).json({ message: "Team not found" });

  if (!team.members.includes(req.user.id)) {
    team.members.push(req.user.id);
  }

  res.json({ message: "Joined team", team });
};

exports.leaveKhatmahTeam = (req, res) => {
  const team = khatmahTeams.find((t) => t.code === req.params.code);
  if (!team) return res.status(404).json({ message: "Team not found" });

  team.members = team.members.filter((id) => id !== req.user.id);
  res.json({ message: "Left the team" });
};

exports.updateMemberProgress = (req, res) => {
  const { code } = req.params;
  const { progress } = req.body;

  const team = khatmahTeams.find((t) => t.code === code);
  if (!team) return res.status(404).json({ message: "Team not found" });

  team.progress[req.user.id] = progress;
  res.json({ message: "Progress updated" });
};
