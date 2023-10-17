const express = require('express');
const router = express.Router();
const bcrypt=require('bcrypt');
const Candidate=require('../models/candidate')
const Recruiter=require('../models/recruiter')
Candidate.syncIndexes();
function validateEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return {"message":'Invalid email'};
  }
  return {"message":"OK"};
}
function validateName(name) {
  const nameRegex = /^.{1,}$/;
  if (!nameRegex.test(name)) {
    return {"message":'Name cannot be empty'};
  }
  return {"message":"OK"};
}
function validatePassword(password) {
  const passwordRegex = /^.{8,}$/;
  if (!passwordRegex.test(password)) {
    return {"message":'Password must be at least 8 characters long'};
  }
  return {"message":"OK"};
}
// Create a new candidate
router.post('/', async (req, res) => {
   try {
      let em=validateEmail(req.body.email);
      let na=validateName(req.body.name);
      let pa=validatePassword(req.body.password);
    if(em.message!="OK"){
        res.status(300).send(em);
        return;
    }
    
    if(na.message?na.message!="OK":false){
      res.status(300).send(em);
      return;
    }
    if (pa.message!="OK"){
       res.status(300).send(pa);
       return;
    }
   let can= await Candidate.findOne({email:req.body.email});
   let can2= await Recruiter.findOne({email:req.body.email});
    if(can || can2){
      return res.status(300).json({message:'User already exists'})
    }
    const candidate = new Candidate(req.body);
    candidate.password=await bcrypt.hash(candidate.password,12);
    await candidate.save();
    console.log("New Candidate Created")
    res.status(201).json({message:"Success"});

  } catch (error) {
    res.status(400).send({message:"Error"});
  }
});

// Get all candidates
router.get('/', async (req, res) => {
  try {
    const candidates = await Candidate.find();
    res.send(candidates);
  } catch (error) {
    res.status(500).send(error);
  }
});

// Get a candidate by ID
router.get('/:id', async (req, res) => {
  try {
    const candidate = await Candidate.findById(req.params.id);
    if (!candidate) {
      return res.status(404).json({message:"Not Found"});
    }
    res.status(200).json({message:"Success",candidate:candidate});
  } catch (error) {
    res.status(500).json({message:"Internal Server Error"});
  }
});
//update saved jobs
router.patch('/savedJobs/:id',async(req,res)=>{
  const updates = Object.keys(req.body);
  const allowedUpdates = ['savedJobs'];
  const isValidOperation = updates.every((update) => allowedUpdates.includes(update));
  if (!isValidOperation) {
    return res.status(400).send({ error: 'Invalid updates!' });
  }
  try {
    let candidate=await Candidate.findById(req.params.id)

    if(candidate.savedJobs.indexOf(req.body.savedJobs)>-1){
      candidate = await Candidate.findByIdAndUpdate(req.params.id,{$pull:{savedJobs:req.body.savedJobs}}, { new: true, runValidators: true });    
    }else{
      candidate = await Candidate.findByIdAndUpdate(req.params.id,{$addToSet:{savedJobs:req.body.savedJobs}}, { new: true, runValidators: true });    
    }

    if (!candidate) {
      return res.status(404).send({message:"Error"});
    }
    res.send({user:candidate,message:"Success"});
  } catch (error) {
    res.status(400).send({message:"Error"});
  }
})
// Update a candidate by ID
router.patch('/:id', async (req, res) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = ['name', 'accountType', 'email', 'password', 'phone', 'skills', 'resume','gender', 'savedJobs','location', 'experience', 'education'];
  const isValidOperation = updates.every((update) => allowedUpdates.includes(update));

  if (!isValidOperation) {
    return res.status(400).json({ message: 'Invalid updates!' });
  }
  try {
    const candidate = await Candidate.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!candidate) {
      return res.status(404).send({message:"Error"});
    }
    res.status(200).json({user:candidate,message:"Success"});
  } catch (error) {
    res.status(500).json({message:"Server Error"});
  }
});
// Delete a candidate by ID
router.delete('/:id', async (req, res) => {
  try {
    const candidate = await Candidate.findByIdAndDelete(req.params.id);
    if (!candidate) {
      return res.status(404).send();
    }
    res.send(candidate);
  } catch (error) {
    res.status(500).send(error);
  }
});

module.exports = router;