const express = require("express")
const cors = require("cors")
const {sequelize} = require("./config/db")
const app = express();
require("dotenv").config();
const userRoutes = require("./Routes/users")

app.use(cors());
app.use(express.json())

app.use("/api/users",userRoutes)


    const PORT = process.env.PORT;
    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
  

module.exports = app;