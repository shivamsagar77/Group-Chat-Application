const express = require("express")
const router = express.Router()
const ConversationMemberController = require("../Controller/conversation_member")

router.post("/add_member",ConversationMemberController.addMember)
router.get("/get_members/:member_id",ConversationMemberController.getMembers)
router.delete("/delete_member/:member_id",ConversationMemberController.deleteMember)
router.get("/get_user_conversations/:user_id",ConversationMemberController.getUserConversations)


module.exports = router;