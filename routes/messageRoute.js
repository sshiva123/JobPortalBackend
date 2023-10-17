const express = require('express');
const router = express.Router();
const Message=require('../models/message')

router.post('/',async(req,res)=>{
    try{
        const newMessage=new Message(req.body);
        const savedMessage=await newMessage.save();
        res.status(200).json(savedMessage);
    }catch(err){
        res.status(500).json(err);
    }
})
router.get('/:conversationId',async(req,res)=>{
    try{
        const allMessages=await Message.find({conversationId:req.params.conversationId})

        res.status(200).json(allMessages);
    }catch(err){
        res.status(500).json(err);
    }
})
router.get('/one/:conversationId',async(req,res)=>{
    try{
        const allMessages=await Message.find({conversationId:req.params.conversationId}).sort({_id:-1}).limit(1);

        res.status(200).json(allMessages);
    }catch(err){
        res.status(500).json(err);
    }
})
module.exports=router;

