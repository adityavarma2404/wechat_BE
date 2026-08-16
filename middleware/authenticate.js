const { verifyAccessToken } = require("../services/auth");

function authenticate(req, res, next) {
  const authorization = req.get("authorization");
  const [scheme, token] = authorization?.split(" ") || [];

  if (scheme !== "Bearer" || !token) {
    return res.status(401).json({ message: "Access token is missing" });
  }

  try {
    req.user = verifyAccessToken(token);
    return next();
  } catch {
    return res.status(401).json({ message: "Access token is invalid or expired" });
  }
}

module.exports = authenticate;
