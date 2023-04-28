const express = require('express');
const router = express.Router();
const bcrypt=require('bcrypt');
const Candidate=require('../models/candidate')

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
   
    const candidate = new Candidate(req.body);
    candidate.password=await bcrypt.hash(candidate.password,12);
    await candidate.save();
    console.log("New Candidate Created")
    res.status(201).send(candidate);
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
      return res.status(404).send();
    }
    res.send(candidate);
  } catch (error) {
    res.status(500).send(error);
  }
});

// Update a candidate by ID
router.patch('/:id', async (req, res) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = ['name', 'accountType', 'email', 'password', 'phone', 'skills', 'resume','gender', 'location', 'experience', 'education'];
  const isValidOperation = updates.every((update) => allowedUpdates.includes(update));

  if (!isValidOperation) {
    return res.status(400).send({ error: 'Invalid updates!' });
  }
  try {
    const candidate = await Candidate.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!candidate) {
      return res.status(404).send({message:"Error"});
    }
    res.send(candidate);
  } catch (error) {
    res.status(400).send(error);
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