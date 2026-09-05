const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema(
  {
    conversationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Conversation",
      required: true,
    },

    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    type: {
      type: String,
      enum: ["text", "image", "video", "file", "audio"],
      default: "text",
    },

    content: {
      type: String,
      default: "",
    },

    attachment: {
      url: {
        type: String,
        default: null,
      },

      fileName: {
        type: String,
        default: null,
      },

      size: {
        type: Number,
        default: null,
      },
    },

    editedAt: {
      type: Date,
      default: null,
    },

    deletedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  },
);
messageSchema.index({
  conversationId: 1,
  createdAt: -1,
});

module.exports = mongoose.model("messages", messageSchema);
