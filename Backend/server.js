const express = require("express")
const cors = require("cors")
const {sequelize} = require("./config/db")
const app = express();
require("dotenv").config();
const userRoutes = require("./Routes/users")
const conversationMemberRoutes = require("./Routes/conversation_members")
const MessagesRoutes = require("./Routes/messages")
app.use(cors());
app.use(express.json())

app.use("/api/users",userRoutes)
app.use("/api/conversation_members",conversationMemberRoutes)
app.use("/api/messages",MessagesRoutes)

    const PORT = process.env.PORT;
    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
  

module.exports = app;