const express = require('express');
const router = express.Router();    
const Conversation=require('../models/conversation');

//create new
router.post('/',async (req,res)=>{
    try {
    const newConversation=new Conversation({
        members:[req.body.senderId,req.body.receiverId]
    })
    const savedConversation=await newConversation.save();
    res.status(200).json(savedConversation);
    }catch(err){
        res.status(500).json(err);
    }
});
// get all convo
router.get('/:id',async(req,res)=>{
    try{
        const convo=await Conversation.find({members:{$in:[req.params.id]}}).sort({updatedAt: -1});
        res.status(200).json(convo); 
    }catch(err){
        res.status(500).json(err);
    }
})

module.exports=router;