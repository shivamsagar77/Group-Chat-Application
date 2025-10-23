const User = require("../Models/User")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken");
const { where } = require("sequelize");
const conversationMember = require("../Models/conversation_member")
const userController = {
    registerUser: async (req,res)=>{
   try{
const {name,email,phone_number,password} = req.body;
if(!name || !email || !phone_number || !password){
    return res.status(400).json({message:"All fields are required"})
}
const user = await User.findOne({where:{email}})
if(user){
    return res.status(400).json({
        success:false,
        message:"User already exists"
    })
}
const hashedPassword = await bcrypt.hash(password,10);
const newUser = await User.create({name,email,phone_number,password:hashedPassword});
const token = jwt.sign({id:newUser.id},process.env.JWT_SECRET,{expiresIn:"1h"});
res.status(201).json(
    {success:true,
    message:"User registered successfully",data:{user:newUser.name,token}});
}catch(e){
  return res.status(500).json({message:"Internal server error",error:e.message})
}
},
    loginUser:async (req,res)=>{
      try {
        const {email,password} = req.body;
        console.log(email,password,"email and password" )
        if(!email || !password){
            return res.status(400).json({
                success:false,
                message:"All fields are required"
            })
        }

       const userExit = await User.findOne({
        where:{email},
        attributes:["id","name","email","password"]
    });
     if(!userExit){
        res.status(400).json({
            success:false,
            message:"User doesn't exits "
        })
     }
    console.log("here")
      const isPasswordMatch = await bcrypt.compare(password, userExit.password);

        if (!isPasswordMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }
  
    const token = jwt.sign({id:userExit.id},process.env.JWT_SECRET,{expiresIn:"1h"});
    return res.status(200).json({
      success:true,
      message:"login successfully",
      data:{
        user:{
          id:userExit.id,
          name:userExit.name || "User",
          email:userExit.email
        },
        token:token
      }
    })
      } catch (error) {
      return  res.status(500).json({
        success:false,
        message:error
      })
      }    
    },
    getUserForChat:async (req,res)=>{
      try {
        const {user_id} = req.query;
        if(!user_id){
          return res.status(400).json({success:false,message:"User ID is required"})
        }
        
        // Fetch all users
        const users = await User.findAll();
        
        // Fetch conversation members for current user
        const conversationMembers = await conversationMember.findAll({
          where: { user_id: user_id }
        });
        
        // Get all user_ids that are in conversations
        const userIdsInConversations = conversationMembers.map(member => member.user_id);
        
        // Filter users who are NOT in any conversation (exclude current user)
        const usersWithoutConversationMembers = users.filter(user => 
          !userIdsInConversations.includes(user.id) && user.id != user_id
        );
        
        if(usersWithoutConversationMembers.length === 0){
          return res.status(404).json({success:false,message:"No users without conversation members found"})
        }
     
        return res.status(200).json({success:true,message:"Users without conversation members fetched successfully",data:usersWithoutConversationMembers})
      } catch (error) {
        return res.status(500).json({success:false,message:"Internal server error",error:error.message})
      }
    }

}
module.exports = userController