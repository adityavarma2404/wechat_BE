const mongoose = require("mongoose");
const argon2 = require("argon2");

const userSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: true,
  },
  profileImage: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

userSchema.pre("save", async function () {
  if (!this.isModified("password")) return;
  this.password = await argon2.hash(this.password, {
    type: argon2.argon2id,
    memoryCost: 19456,
    timeCost: 2,
    parallelism: 1,
  });
});

userSchema.methods.verifyPassword = function (enteredPassword) {
  return argon2.verify(this.password, enteredPassword);
};

module.exports = mongoose.model("User", userSchema);
