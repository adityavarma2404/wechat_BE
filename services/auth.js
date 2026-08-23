const jwt = require("jsonwebtoken");

const accessTokenSecret =
  process.env.ACCESS_TOKEN_SECRET || "development-access-token-secret";
const refreshTokenSecret =
  process.env.REFRESH_TOKEN_SECRET || "development-refresh-token-secret";

function createTokenPayload(user) {
  return {
    _id: user._id,
    email: user.email,
    fullName: user.fullName,
    profileImage: user.profileImage,
  };
}

function createAccessToken(user) {
  return jwt.sign(createTokenPayload(user), accessTokenSecret, {
    expiresIn: "1m",
  });
}

function createRefreshToken(user) {
  //TODO: hash the access token before sending it and store the token in DB.
  //because even if user logout we are just clearing the cookies but still the token is valid.
  //so store the token and make it invalid.
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
