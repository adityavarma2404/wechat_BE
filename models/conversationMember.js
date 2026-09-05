const mongoose = require("mongoose");

const conversationMemberSchema = new mongoose.Schema(
  {
    conversationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Conversation",
      required: true,
    },

    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    role: {
      type: String,
      enum: ["member", "admin"],
      default: "member",
    },

    muted: {
      type: Boolean,
      default: false,
    },

    lastReadMessageId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Message",
      default: null,
    },

    joinedAt: {
      type: Date,
      default: Date.now,
    },

    leftAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  },
);
conversationMemberSchema.index(
  {
    userId: 1,
    conversationId: 1,
  },
  {
    unique: true,
  },
);
module.exports = mongoose.model("ConversationMember", conversationMemberSchema);
