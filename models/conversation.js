const mongoose=require('mongoose')
const  ConversationSchema=new mongoose.Schema({
    members:[{type:String}],
    count:{type:Number,default:0}
},{timestamps:true});
module.exports=mongoose.model("Conversation",ConversationSchema);