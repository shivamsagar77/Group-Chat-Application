const {Sequelize} = require("sequelize")

const sequelize = new Sequelize('group_chat','postgres','shivam1234',{

host:'localhost',
dialect:'postgres',
port:5432,
loggingg:false
})

sequelize.authenticate()
  .then(()=>{
    console.log("Database is connected");
  }).catch((err)=>{
    console.error("unable to join ",err)
  })

module.exports = { sequelize, Sequelize };
  