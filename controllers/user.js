const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const users = []; // Temporary in-memory array (replace with DB in production)

// Utility to generate fake confirmation codes
const generateCode = () =>
  Math.floor(100000 + Math.random() * 900000).toString();

exports.createTabseraQuranUser = async (req, res) => {
  const { name, email, password } = req.body;
  if (users.find((u) => u.email === email)) {
    return res.status(400).json({ message: "User already exists" });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = {
    id: Date.now(),
    name,
    email,
    password: hashedPassword,
    role: "student",
    confirmed: false,
    confirmationCode: generateCode(),
  };

  users.push(newUser);

  // Normally you'd send this via email
  console.log("Confirmation code:", newUser.confirmationCode);

  res
    .status(201)
    .json({ message: "User registered. Please verify your email." });
};

exports.confirmTabseraQuranUser = (req, res) => {
  const { email, code } = req.body;
  const user = users.find((u) => u.email === email);

  if (!user) return res.status(404).json({ message: "User not found" });
  if (user.confirmed)
    return res.status(400).json({ message: "Already confirmed" });

  if (user.confirmationCode === code) {
    user.confirmed = true;
    return res.json({ message: "User confirmed successfully" });
  }

  res.status(400).json({ message: "Invalid code" });
};

exports.loginTabseraQuran = async (req, res) => {
  const { email, password } = req.body;
  const user = users.find((u) => u.email === email);

  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  const token = jwt.sign({ id: user.id, role: user.role }, "secret", {
    expiresIn: "1d",
  });

  res.json({
    token,
    user: { id: user.id, name: user.name, email: user.email },
  });
};

exports.googleLoginTabseraQuran = (req, res) => {
  const { email } = req.body;
  let user = users.find((u) => u.email === email);

  if (!user) {
    user = {
      id: Date.now(),
      name: "Google User",
      email,
      password: null,
      role: "student",
      confirmed: true,
    };
    users.push(user);
  }

  const token = jwt.sign({ id: user.id, role: user.role }, "secret", {
    expiresIn: "1d",
  });
  res.json({ token, user });
};

exports.resendCodeForTabseraQuran = (req, res) => {
  const { email } = req.body;
  const user = users.find((u) => u.email === email);
  if (!user) return res.status(404).json({ message: "User not found" });

  user.confirmationCode = generateCode();
  console.log("Resent confirmation code:", user.confirmationCode);
  res.json({ message: "Confirmation code resent" });
};

exports.forgotPasswordForTabseraQuran = (req, res) => {
  const { email } = req.body;
  const user = users.find((u) => u.email === email);
  if (!user) return res.status(404).json({ message: "User not found" });

  user.resetCode = generateCode();
  console.log("Reset code:", user.resetCode);
  res.json({ message: "Reset code sent" });
};

exports.resetPasswordForTabseraQuran = async (req, res) => {
  const { email, code, password } = req.body;
  const user = users.find((u) => u.email === email);
  if (!user || user.resetCode !== code) {
    return res.status(400).json({ message: "Invalid reset code" });
  }

  user.password = await bcrypt.hash(password, 10);
  delete user.resetCode;
  res.json({ message: "Password reset successfully" });
};

exports.teacherLoginForTabseraQuran = async (req, res) => {
  const { email, password } = req.body;
  const user = users.find((u) => u.email === email && u.role === "teacher");

  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  const token = jwt.sign({ id: user.id, role: user.role }, "secret", {
    expiresIn: "1d",
  });
  res.json({
    token,
    user: { id: user.id, name: user.name, email: user.email },
  });
};

exports.getProfileForTabseraQuran = (req, res) => {
  const user = users.find((u) => u.id === req.user.id);
  if (!user) return res.status(404).json({ message: "User not found" });
  res.json({ user });
};

exports.editProfileForTabseraQuran = (req, res) => {
  const user = users.find((u) => u.id === req.user.id);
  if (!user) return res.status(404).json({ message: "User not found" });

  const updates = req.body;
  Object.assign(user, updates);
  res.json({ message: "Profile updated", user });
};

exports.getProfileMetaForTabseraQuran = (req, res) => {
  res.json({
    degrees: ["Bachelor", "Master", "PhD"],
    experiences: ["1-2 years", "3-5 years", "5+ years"],
  });
};

exports.getCitiesForTabseraQuran = (req, res) => {
  const { country } = req.params;
  const cities = {
    Somalia: ["Mogadishu", "Hargeisa", "Kismayo"],
    Egypt: ["Cairo", "Alexandria"],
  };
  res.json({ cities: cities[country] || [] });
};

exports.deleteTabseraQuranUser = (req, res) => {
  const index = users.findIndex((u) => u.id === req.user.id);
  if (index === -1) return res.status(404).json({ message: "User not found" });

  users.splice(index, 1);
  res.json({ message: "User deleted" });
};

exports.googleSetup = (req, res) => {
  const user = users.find((u) => u.id === req.user.id);
  if (!user) return res.status(404).json({ message: "User not found" });

  user.googleLinked = true;
  res.json({ message: "Google account linked" });
};
