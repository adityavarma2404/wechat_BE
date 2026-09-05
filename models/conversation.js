const mongoose = require("mongoose");

const conversationSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ["direct", "group"],
      required: true,
      index: true,
    },

    name: {
      type: String,
      default: null,
      trim: true,
    },

    image: {
      type: String,
      default: null,
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    // Only used for direct conversations
    directKey: {
      type: String,
      default: null,
    },

    lastMessage: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Message",
      default: null,
    },
  },
  {
    timestamps: true,
  },
);

// Prevent duplicate direct conversations
conversationSchema.index(
  { directKey: 1 },
  {
    unique: true,
    partialFilterExpression: {
      type: "direct",
    },
  },
);

module.exports = mongoose.model("Conversation", conversationSchema);
