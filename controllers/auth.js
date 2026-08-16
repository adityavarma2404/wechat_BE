const {
  createAccessToken,
  createRefreshToken,
  verifyRefreshToken,
} = require("../services/auth");

const refreshCookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax",
  path: "/api/auth",
  maxAge: 7 * 24 * 60 * 60 * 1000,
};

function getCookie(req, name) {
  const cookies = req.headers.cookie?.split(";") || [];

  for (const cookie of cookies) {
    const [key, ...value] = cookie.trim().split("=");
    if (key === name) return decodeURIComponent(value.join("="));
  }

  return undefined;
}

async function handleUserLogin(req, res) {
  const { email, password } = req.body;

  // Replace this demo user with your database/password validation.
  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }

  const user = { _id: 36254, email };
  const accessToken = createAccessToken(user);
  const refreshToken = createRefreshToken(user);

  res.cookie("refreshToken", refreshToken, refreshCookieOptions);
  return res.json({ accessToken, user });
}

function handleTokenRefresh(req, res) {
  const refreshToken = getCookie(req, "refreshToken");

  if (!refreshToken) {
    return res.status(401).json({ message: "Refresh token is missing" });
  }

  try {
    const payload = verifyRefreshToken(refreshToken);
    const user = { _id: payload._id, email: payload.email };

    return res.json({ accessToken: createAccessToken(user), user });
  } catch {
    res.clearCookie("refreshToken", refreshCookieOptions);
    return res.status(401).json({ message: "Refresh token is invalid or expired" });
  }
}

function handleUserLogout(req, res) {
  res.clearCookie("refreshToken", refreshCookieOptions);
  return res.status(204).send();
}

module.exports = { handleUserLogin, handleTokenRefresh, handleUserLogout };
