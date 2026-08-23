const express = require("express");
const {
  handleUserLogin,
  handleTokenRefresh,
  handleUserLogout,
  handleUserSignup,
} = require("../controllers/auth");
const authenticate = require("../middleware/authenticate");

const router = express.Router();

router.post("/auth/login", handleUserLogin);
router.post("/auth/refresh", handleTokenRefresh);
router.post("/auth/logout", handleUserLogout);
router.post("/auth/signup", handleUserSignup);
router.get("/auth/me", authenticate, (req, res) => {
  return res.json({ user: { _id: req.user._id, email: req.user.email } });
});

module.exports = router;
