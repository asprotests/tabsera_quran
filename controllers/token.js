const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const config = require("../config");

exports.getTabseraAccessToken = (req, res) => {
  const { clientId, clientSecret } = req.body;

  const expectedClientId = config.tabseraQuranClient.clientId;
  const expectedHashedSecret = config.tabseraQuranClient.clientSecretHash;
  const hmacKey = config.tabseraQuranClient.clientHmacHashingKey;

  if (clientId !== expectedClientId) {
    return res.status(403).json({ message: "Invalid client ID" });
  }

  const hmac = crypto.createHmac("sha256", hmacKey);
  hmac.update(clientSecret);
  const calculatedSecretHash = hmac.digest("hex");

  if (calculatedSecretHash !== expectedHashedSecret) {
    return res.status(403).json({ message: "Invalid client secret" });
  }

  const token = jwt.sign(
    { clientId },
    config.tabseraQuranClient.clientTokenSecretKey,
    { expiresIn: "2h" }
  );

  res.json({ token });
};
