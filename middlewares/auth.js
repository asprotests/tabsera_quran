const jwt = require("jsonwebtoken");
const config = require("../config");
const userTypes = require("../consts/userTypes");

const users = []; // Use shared in-memory array

exports.AuthenticateQuranClientMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ message: "Missing token" });

  const token = authHeader.replace("Bearer ", "");
  try {
    const payload = jwt.verify(
      token,
      config.tabseraQuranClient.clientTokenSecretKey
    );
    if (payload.clientId !== config.tabseraQuranClient.clientId) {
      return res.status(403).json({ message: "Invalid client token" });
    }
    next();
  } catch (err) {
    res.status(401).json({ message: "Invalid or expired token" });
  }
};

exports.AuthenticateForQuranMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ message: "Missing token" });

  const token = authHeader.replace("Bearer ", "");
  try {
    const payload = jwt.verify(token, "secret"); // Replace with config.JWT in production
    const user = users.find((u) => u.id === payload.id);
    if (!user) return res.status(401).json({ message: "User not found" });

    req.user = user;
    next();
  } catch (err) {
    res.status(401).json({ message: "Invalid token" });
  }
};

exports.UserRolesForQuranMiddleware = (allowedRoles) => (req, res, next) => {
  if (!req.user || !allowedRoles.includes(req.user.role)) {
    return res.status(403).json({ message: "Access denied" });
  }
  next();
};
