const express = require("express")
const router = express.Router()
const UserController = require("../Controller/user")


router.post("/register",UserController.registerUser)
router.post("/login",UserController.loginUser)
// router.post("/forgot-password",forgotPassword)
// router.post("/reset-password",resetPassword)

module.exports = router