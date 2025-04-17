const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const config = require("../config");

const getTabseraAccessToken = async (req, res) => {
  try {
    const { clientId, clientSecret } = req.body;

    if (clientId !== config.tabseraQuranClient.clientId) {
      return res.status(400).json({ message: "Client ID is incorrect" });
    }

    const hmac = crypto.createHmac(
      "sha256",
      config.tabseraQuranClient.clientHmacHashingKey
    );
    hmac.update(clientSecret);
    const secretHash = hmac.digest("hex");

    if (secretHash !== config.tabseraQuranClient.clientSecret) {
      return res.status(400).json({ message: "Client secret is incorrect" });
    }

    const accessToken = jwt.sign(
      { clientId },
      config.tabseraQuranClient.clientTokenSecretKey,
      { expiresIn: "1d" }
    );

    return res.status(200).json({
      accessToken,
    });
  } catch (err) {
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

module.exports = {
  getTabseraAccessToken,
};
