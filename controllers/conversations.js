const Conversation = require("../models/conversation");
const ConversationMember = require("../models/conversationMember");

async function handleDirectConversation(req, res) {
  const otherUserId = req.body.participantId;
  const directKey = [req.user._id.toString(), otherUserId.toString()]
    .sort()
    .join(":");
  let conversation = await Conversation.findOne({
    type: "direct",
    directKey,
  });
  if (!conversation) {
    conversation = await Conversation.create({
      type: "direct",
      directKey,
    });
    await ConversationMember.insertMany([
      {
        conversationId: conversation._id,
        userId: req.user._id,
      },
      {
        conversationId: conversation._id,
        userId: otherUserId,
      },
    ]);
  }
  return res.json({
    conversationId: conversation._id,
  });
}

module.exports = { handleDirectConversation };
