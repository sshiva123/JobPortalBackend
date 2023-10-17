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
//new convo again (made just so that i wouldnt have to change previous code)
router.post('/new',async (req,res)=>{
    try {
    const newConversation=new Conversation({
        members:[req.body.senderId,req.body.receiverId]
    })
    const savedConversation=await newConversation.save();
    res.status(200).json({message:"Success",conversation:savedConversation});
    }catch(err){
        res.status(500).json({message:"Internal Server Error"});
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
//find convo with members
router.post('/getConvo',async(req,res)=>{
    try{
        const convo=await Conversation.find({members:{$all:[req.body.id1 , req.body.id2]}});
        if(convo[0]){
            res.status(200).json({message:"Success",conversation:convo}); 
        }else{
            res.status(404).json({message:"Not Found"})
        }
       
    }catch(err){
        res.status(500).json({message:"Internal Server Error"});
    }
})

module.exports=router;