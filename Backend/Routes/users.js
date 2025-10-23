const express = require("express")
const router = express.Router()
const UserController = require("../Controller/user")


router.post("/register",UserController.registerUser)
router.post("/login",UserController.loginUser)
router.get("/get_user_for_chat/",UserController.getUserForChat)
// router.post("/forgot-password",forgotPassword)
// router.post("/reset-password",resetPassword)

module.exports = router