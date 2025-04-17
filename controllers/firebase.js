const deviceTokens = [];

exports.saveDeviceToken = (req, res) => {
  const { token } = req.body;
  const userId = req.user.id;

  // Check if this token already exists for this user
  const existing = deviceTokens.find(
    (dt) => dt.userId === userId && dt.token === token
  );
  if (existing) {
    return res.status(200).json({ message: "Token already saved" });
  }

  deviceTokens.push({
    id: Date.now(),
    userId,
    token,
    createdAt: new Date(),
  });

  res.status(201).json({ message: "Device token saved" });
};
