const UserModel = require("../models/users");

async function handleUserSearch(req, res) {
  try {
    const email = req.query.email?.trim();

    if (!email) {
      return res.status(400).json({ message: "Email query is required" });
    }

    const escapedEmail = email.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const users = await UserModel.find({
      _id: { $ne: req.user._id },
      email: { $regex: escapedEmail, $options: "i" },
    })
      .select("_id fullName email profileImage")
      .limit(10)
      .lean();

    return res.status(200).json({ users });
  } catch (error) {
    console.error("Unable to search users:", error);
    return res.status(500).json({ message: "Unable to search users" });
  }
}

module.exports = { handleUserSearch };
