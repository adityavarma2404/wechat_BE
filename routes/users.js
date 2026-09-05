const express = require("express");
const {
  handleUserSearch,
  handleUserConversations,
} = require("../controllers/users");
const authenticate = require("../middleware/authenticate");

const router = express.Router();

router.get("/users/search", authenticate, handleUserSearch);
router.get("/users/conversations", authenticate, handleUserConversations);

module.exports = router;
