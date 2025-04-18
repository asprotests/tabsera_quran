const DeviceToken = require("../models/deviceToken");

exports.saveDeviceToken = async (req, res) => {
  try {
    const { token } = req.body;
    const userId = req.user.id;

    // Check if already exists
    const exists = await DeviceToken.findOne({ userId, token });
    if (exists) {
      return res.status(200).json({ message: "Token already exists" });
    }

    await DeviceToken.create({ userId, token });
    res.status(201).json({ message: "Token saved" });
  } catch (err) {
    res.status(500).json({ message: "Failed to save token" });
  }
};
