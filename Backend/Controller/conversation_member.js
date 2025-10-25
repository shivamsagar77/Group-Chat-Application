const ConversationMember = require("../Models/conversation_member");
const UserModel = require("../Models/User");

const conversationMemberController = {
    addMember: async (req,res)=>{
        try {
            const {member_id,user_id} = req.body;
            if(!member_id || !user_id){
                return res.status(400).json({message:"All fields are required"})
            }
const IsuserExits = await ConversationMember.findOne({where:{user_id,member_id}});
if(IsuserExits){
 return res.status(400).json({
    success:false,
    message:"Relation already exits"
 })
}
            
            await ConversationMember.create({member_id,user_id});
            await ConversationMember.create({member_id:user_id,user_id:member_id});
            return res.status(201).json({success:true,message:"Member added successfully"})
        } catch (error) {
            return res.status(500).json({message:"Internal server error",error:error.message})
        }
    },
    getMembers: async (req,res)=>{
        try {
            const {conversation_id} = req.params;
            if(!conversation_id){
                return res.status(400).json({message:"Conversation ID is required"})
            }
            const members = await ConversationMember.findAll({where:{conversation_id}});
            return res.status(200).json({success:true,message:"Members fetched successfully",data:members})
        } catch (error) {
            return res.status(500).json({success:false,message:"Internal server error",error:error.message})
        }
    },
    deleteMember: async (req,res)=>{
        try {
            const {member_id} = req.params;
            if(!member_id){
                return res.status(400).json({success:false,message:"Member ID is required"})
            }
            const member = await ConversationMember.findOne({where:{id:member_id}});
            if(!member){
                return res.status(400).json({success:false,message:"Member not found"})
            }
            await member.destroy();
            return res.status(200).json({success:true,message:"Member deleted successfully"})
        } catch (error) {
            return res.status(500).json({success:false,message:"Internal server error",error:error.message})
        }
    },
    getUserConversations: async (req,res)=>{
        try {
            const {user_id} = req.params;
            if(!user_id){
                return res.status(400).json({success:false,message:"User ID is required"})
            }
            const conversations = await ConversationMember.findAll({where:{user_id},
                attributes:["member_id"],
                include:[
                    {
                        model:UserModel,
                        as:"member",
                      attributes:["name"]
                    }
                ],
             
            });
          

            let conversation_data = conversations.filter((item)=>item.member_id !=user_id)
            return res.status(200).json({success:true,message:"User conversations fetched successfully",data:conversation_data})
        } catch (error) {
            return res.status(500).json({success:false,message:"Internal server error",error:error.message})
        }
    },
}

module.exports = conversationMemberController;