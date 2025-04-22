const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { OAuth2Client } = require("google-auth-library");
const client = new OAuth2Client();

const User = require("../models/user");

exports.createTabseraQuranUser = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      userName,
      email,
      password,
      country,
      gender,
      language,
    } = req.body;

    const existing = await User.findOne({ email });
    if (existing)
      return res.status(400).json({ message: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const confirmationCode = Math.floor(
      100000 + Math.random() * 900000
    ).toString();

    await User.create({
      firstName,
      lastName,
      userName,
      email,
      password: hashedPassword,
      country,
      gender,
      language,
      confirmationCode,
      confirmed: false,
      role: "student",
    });

    res
      .status(201)
      .json({ message: "User registered. Please confirm your email." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Registration failed" });
  }
};

exports.confirmTabseraQuranUser = async (req, res) => {
  try {
    const { email, otp } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    if (user.confirmed) {
      return res.status(400).json({ message: "User already confirmed" });
    }

    if (user.confirmationCode !== otp) {
      return res.status(400).json({ message: "Invalid OTP code" });
    }

    user.confirmed = true;
    await user.save();

    res.status(200).json({ message: "User successfully confirmed" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Confirmation failed" });
  }
};

exports.checkUserForTabseraQuran = async (req, res) => {
  try {
    const { email } = req.params;
    const user = await User.findOne({ email });
    res.json({ exists: !!user });
  } catch (err) {
    res.status(500).json({ message: "Error checking user" });
  }
};

exports.loginTabseraQuran = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword)
      return res.status(400).json({ message: "Invalid password" });

    if (!user.confirmed) {
      return res
        .status(400)
        .json({ message: "Please confirm your email first" });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.status(200).json({
      token,
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        userName: user.userName,
        email: user.email,
        country: user.country,
        gender: user.gender,
        language: user.language,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Login failed" });
  }
};

exports.googleLoginTabseraQuran = async (req, res) => {
  try {
    const { token } = req.body;

    // Verify Google token
    const ticket = await client.verifyIdToken({ idToken: token });
    const payload = ticket.getPayload();

    const { email, given_name, family_name, name } = payload;

    // Try finding the user
    let user = await User.findOne({ email });

    // If not found, create it
    if (!user) {
      user = await User.create({
        firstName: given_name || name?.split(" ")[0],
        lastName: family_name || name?.split(" ")[1],
        userName: email.split("@")[0],
        email,
        googleLinked: true,
        confirmed: true, // since Google verifies email
        role: "student",
      });
    }

    // Generate app token
    const appToken = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.status(200).json({
      token: appToken,
      user: {
        id: user._id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        googleLinked: user.googleLinked,
      },
    });
  } catch (err) {
    console.error("Google login error:", err);
    res.status(401).json({ message: "Google login failed" });
  }
};

exports.resendCodeForTabseraQuran = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    if (user.confirmed)
      return res.status(400).json({ message: "User already confirmed" });

    const newCode = Math.floor(100000 + Math.random() * 900000).toString();
    user.confirmationCode = newCode;
    await user.save();

    console.log("📨 Resent confirmation code:", newCode); // Replace with actual email or SMS

    res.status(200).json({ message: "Confirmation code resent" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to resend confirmation code" });
  }
};

exports.forgotPasswordForTabseraQuran = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    const resetCode = Math.floor(100000 + Math.random() * 900000).toString();
    user.confirmationCode = resetCode;
    await user.save();

    console.log("📨 Password reset code:", resetCode); // Replace with actual email/SMS later

    res.status(200).json({ message: "Reset code sent" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to process request" });
  }
};

exports.resetPasswordForTabseraQuran = async (req, res) => {
  try {
    const { email, otp, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    if (user.confirmationCode !== otp) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    user.password = await bcrypt.hash(password, 10);
    user.confirmationCode = undefined;
    await user.save();

    res.status(200).json({ message: "Password reset successful" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to reset password" });
  }
};

exports.teacherLoginForTabseraQuran = async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username, role: "teacher" });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      {
        expiresIn: "1d",
      }
    );

    res.json({
      token,
      user: { id: user._id, name: user.name, email: user.email },
    });
  } catch (err) {
    res.status(500).json({ message: "Teacher login failed" });
  }
};

exports.getProfileForTabseraQuran = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json({ user });
  } catch (err) {
    res.status(500).json({ message: "Failed to load profile" });
  }
};

exports.editProfileForTabseraQuran = async (req, res) => {
  try {
    const updates = req.body;
    const user = await User.findByIdAndUpdate(req.user.id, updates, {
      new: true,
    });

    if (!user) return res.status(404).json({ message: "User not found" });

    res.json({ message: "Profile updated", user });
  } catch (err) {
    res.status(500).json({ message: "Failed to update profile" });
  }
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
    Somalia: ["Mogadishu", "Hargeisa", "Bosaso"],
    Egypt: ["Cairo", "Alexandria", "Giza"],
  };
  res.json({ cities: cities[country] || [] });
};

exports.deleteTabseraQuranUser = async (req, res) => {
  try {
    const userId = req.user.id;

    const deleted = await User.findByIdAndDelete(userId);
    if (!deleted) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ message: "User deleted successfully" });
  } catch (err) {
    console.error("Delete error:", err);
    res.status(500).json({ message: "Failed to delete user" });
  }
};

exports.googleSetup = async (req, res) => {
  try {
    const { tokenId, gender, country, language } = req.body;

    // Verify Google ID token
    const ticket = await client.verifyIdToken({ idToken: tokenId });
    const payload = ticket.getPayload();

    const { email, given_name, family_name, name } = payload;

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    // Update fields from both token and request
    user.email = email;
    user.firstName = given_name || name?.split(" ")[0] || user.firstName;
    user.lastName = family_name || name?.split(" ")[1] || user.lastName;
    user.userName = user.userName || email.split("@")[0];
    user.googleLinked = true;
    user.gender = gender;
    user.country = country;
    user.language = language;

    await user.save();

    res.status(200).json({ message: "Google setup completed", user });
  } catch (err) {
    console.error("Google setup error:", err);
    res.status(500).json({ message: "Google setup failed" });
  }
};
