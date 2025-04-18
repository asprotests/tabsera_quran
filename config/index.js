require("dotenv").config();

module.exports = {
  tabseraQuranClient: {
    clientId: process.env.CLIENT_ID,
    clientSecretHash: process.env.CLIENT_SECRET_HASH,
    clientHmacHashingKey: process.env.CLIENT_HMAC_HASHING_KEY,
    clientTokenSecretKey: process.env.CLIENT_TOKEN_SECRET_KEY,
  },
};
