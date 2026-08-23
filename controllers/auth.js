const {
  createAccessToken,
  createRefreshToken,
  verifyRefreshToken,
} = require("../services/auth");
const UserModel = require("../models/users");

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
  try {
    const email = req.body.email?.trim().toLowerCase();
    const { password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required" });
    }

    const existingUser = await UserModel.findOne({ email });
    const isValidPassword =
      existingUser && (await existingUser.verifyPassword(password));

    if (!isValidPassword) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const user = {
      _id: existingUser._id,
      fullName: existingUser.fullName,
      email: existingUser.email,
      profileImage: existingUser.profileImage,
      createdAt: existingUser.createdAt,
    };
    const accessToken = createAccessToken(existingUser);
    const refreshToken = createRefreshToken(existingUser);

    res.cookie("refreshToken", refreshToken, refreshCookieOptions);
    return res.status(200).json({ accessToken, user });
  } catch (error) {
    console.error("Unable to log in user:", error);
    return res.status(500).json({ message: "Unable to log in" });
  }
}

function handleTokenRefresh(req, res) {
  const refreshToken = getCookie(req, "refreshToken");

  if (!refreshToken) {
    return res.status(401).json({ message: "Refresh token is missing" });
  }

  try {
    const payload = verifyRefreshToken(refreshToken);
    console.log("payload", payload);

    return res.json({ accessToken: createAccessToken(payload), user: payload });
  } catch {
    res.clearCookie("refreshToken", refreshCookieOptions);
    return res
      .status(401)
      .json({ message: "Refresh token is invalid or expired" });
  }
}

function handleUserLogout(req, res) {
  res.clearCookie("refreshToken", refreshCookieOptions);
  return res.status(204).send();
}

async function handleUserSignup(req, res) {
  try {
    const fullName = req.body.fullName?.trim();
    const email = req.body.email?.trim().toLowerCase();
    const { password } = req.body;

    if (!fullName || !email || !password) {
      return res
        .status(400)
        .json({ message: "Full name, email, and password are required" });
    }

    const existingUser = await UserModel.exists({ email });
    if (existingUser) {
      return res.status(409).json({ message: "Email is already registered" });
    }

    await UserModel.create({ fullName, email, password });

    return res.status(201).json({ message: "User created successfully" });
  } catch (error) {
    if (error?.code === 11000) {
      return res.status(409).json({ message: "Email is already registered" });
    }

    console.error("Unable to create user:", error);
    return res.status(500).json({ message: "Unable to create user" });
  }
}

module.exports = {
  handleUserLogin,
  handleTokenRefresh,
  handleUserLogout,
  handleUserSignup,
};
