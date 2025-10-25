const MessagesModel = require("../Models/messages")
const { Op } = require("sequelize");
const UserModel = require("../Models/User");


const MessagesController = {
  getAllMessage: async (req, res) => {
    try {
      const { user_id, member_id } = req.query;

      if (!user_id || !member_id) {
        return res.status(400).json({
          success: false,
          message: "user_id and member_id are required",
        });
      }
const member_name = await UserModel.findByPk(member_id,{
    attributes:["name"]
});
     
      const messages = await MessagesModel.findAll({
        where: {
          [Op.or]: [
            { user_id, member_id },        
            { user_id: member_id, member_id: user_id } 
          ],
        },
        order: [["created_at", "ASC"]], 
        raw: true
      });

      return res.status(200).json({
        success: true,
        message: "Chat fetched successfully",
        data:{
        member_name:member_name.name,
        messages:messages,
        } 
      });

    } catch (error) {
      console.error("Error in getAllMessage:", error);
      return res.status(500).json({
        success: false,
        message: "Internal server error",
        error: error.message,
      });
    }
  },
  addMessage:async(req,res)=>{
    try {
       const { user_id,message,member_id}= req.body;
console.log(user_id,message,member_id)

    if(!user_id || !message || !member_id){
    return res.status(400).json({
        success:false,
        message:"All field required"
    })
    }

    await MessagesModel.create({user_id,message,member_id,status:"send"});

   return res.status(200).json({
    success:true,
    message:"Message delivered successfully"
    })

    } catch (error) {
        return res.status(500).json({
            success:false,
            error:error
        })
    }
  }
};

module.exports = MessagesController;