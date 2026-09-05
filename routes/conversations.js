const express = require("express");
const authenticate = require("../middleware/authenticate");
const { handleDirectConversation } = require("../controllers/conversations");

const router = express.Router();

router.post("/conversations/direct", authenticate, handleDirectConversation);

module.exports = router;
