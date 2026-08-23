const express = require("express");
const { handleUserSearch } = require("../controllers/users");
const authenticate = require("../middleware/authenticate");

const router = express.Router();

router.get("/users/search", authenticate, handleUserSearch);

module.exports = router;
