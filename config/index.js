require("dotenv").config();

module.exports = {
  tabseraQuranClient: {
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET_HASH,
    clientHmacHashingKey: process.env.CLIENT_HMAC_KEY,
    clientTokenSecretKey: process.env.CLIENT_JWT_SECRET,
  },
};
