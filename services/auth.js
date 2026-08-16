const jwt = require("jsonwebtoken");

const accessTokenSecret =
  process.env.ACCESS_TOKEN_SECRET || "development-access-token-secret";
const refreshTokenSecret =
  process.env.REFRESH_TOKEN_SECRET || "development-refresh-token-secret";

function createTokenPayload(user) {
  return {
    _id: user._id,
    email: user.email,
  };
}

function createAccessToken(user) {
  return jwt.sign(createTokenPayload(user), accessTokenSecret, {
    expiresIn: "1m",
  });
}

function createRefreshToken(user) {
  return jwt.sign(createTokenPayload(user), refreshTokenSecret, {
    expiresIn: "7d",
  });
}

function verifyRefreshToken(token) {
  return jwt.verify(token, refreshTokenSecret);
}

function verifyAccessToken(token) {
  return jwt.verify(token, accessTokenSecret);
}

module.exports = {
  createAccessToken,
  createRefreshToken,
  verifyAccessToken,
  verifyRefreshToken,
};
