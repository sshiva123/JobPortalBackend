const express = require('express');
const router = express.Router();
const bcrypt=require('bcrypt');
const Recruiter = require('../models/recruiter');
const Candidate=require('../models/candidate')
function validateEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!emailRegex.test(email)) {
    return {"message":"Invalid email"};
  }

  return {"message":"OK"};
}
function validateName(name) {
  const nameRegex = /^.{1,}$/;

  if (!nameRegex.test(name)) {
    return {"message":"Name cannot be empty"};
  }

  return {"message":"OK"};
}
function validatePassword(password) {
  const passwordRegex = /^.{8,}$/;

  if (!passwordRegex.test(password)) {
    return  {"message":"Password must be at least 8 characters long"};
  }

  return {"message":"OK"};
}
// Create a new recruiter
router.post('/', async (req, res) => {
  try {
  let em=validateEmail(req.body.email);
  let na=validateName(req.body.name);
  let pa=validatePassword(req.body.password);
  
   
  if(em.message!="OK"){
      return res.status(300).send(em);
  }
  if(na.message!="OK"){
    return res.status(300).send(em);
  }
  if (pa.message!="OK"){
    console.log(pa);
    return res.status(300).send(pa);
  }
 let can= await Candidate.findOne({email:req.body.email});
   let can2= await Recruiter.findOne({email:req.body.email});
  if(can || can2){
    return res.status(300).json({message:'User already exists'})
  }
    const recruiter = new Recruiter(req.body);
    recruiter.password=await bcrypt.hash(recruiter.password,12);
    await recruiter.save();
    res.status(201).json({recruiter:recruiter,message:"Success"});
  } catch (error) {
    res.status(400).json({message:"Internal Server Error"});
  }
});

// Get a recruiter by ID
router.get('/:id', async (req, res) => {
  try {
    const recruiter = await Recruiter.findById(req.params.id);
    if (!recruiter) {
      console.log("Not found");
      return res.status(404).send({"message":"Not Found"});
    }
    res.send(recruiter);
  } catch (error) {
    console.log("error")
    res.status(500).send(error);
  }
});

// Get all recruiters
router.get('/', async (req, res) => {
  try {
    const recruiters = await Recruiter.find();
    res.send(recruiters);
  } catch (error) {
    res.status(500).send(error);
  }
});


// Update a recruiter by ID
router.patch('/:id', async (req, res) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = ['name', 'email', 'password', 'phone', 'location', 'company'];
  const isValidOperation = updates.every((update) => allowedUpdates.includes(update));

  if (!isValidOperation) {
    return res.status(400).send({ error: 'Invalid updates!' });
  }

  try {
    const recruiter = await Recruiter.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!recruiter) {
      return res.status(404).send();
    }
    res.send(recruiter);
  } catch (error) {
    res.status(400).send(error);
  }
});

// Delete a recruiter by ID
router.delete('/:id', async (req, res) => {
  try {
    const recruiter = await Recruiter.findByIdAndDelete(req.params.id);
    if (!recruiter) {
      return res.status(404).send();
    }
    res.send(recruiter);
  } catch (error) {
    res.status(500).send(error);
  }
});

module.exports = router;