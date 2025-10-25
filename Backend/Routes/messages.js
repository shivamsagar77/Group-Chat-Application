const express = require("express");
const router = express.Router();
const MessagesController = require("../Controller/messages")

router.get("/get_all_messages_of_member_id",MessagesController.getAllMessage)
router.post("/send_message",MessagesController.addMessage)

module.exports = router;