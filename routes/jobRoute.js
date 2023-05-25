const express = require('express');
const router = express.Router();
const Job = require('../models/job');
const Recruiter=require('../models/recruiter')
//update indexes after your update shema():
//Coz apparantly mongoose doesnot do it automatically
// Job.syncIndexes();
// Create a new job
router.post('/', async (req, res) => {
  try {
    const job = new Job(req.body);
    await job.save();
    res.status(201).json(job);
  } catch (error) {
    res.status(400).json(error);
  }
});
// Get all jobs
router.get('/', async (req, res) => {
  try {
    const jobs = await Job.find();
    res.status(200).json(jobs);
  } catch (error) {
    res.status(500).json({message:"Error",error:error});
  }
});
//Get popukar jobs
router.get('/popular', async (req, res) => {
  try {
    const jobs = await Job.find().sort({ jobViews: -1 }).limit(5);
    let temp = [];
    for (let job of jobs) {
      let poster = await Recruiter.findOne({ _id: job.company_id }).exec();
      let temp2=job.toObject();
      poster.password='';
      temp2.companyData = poster.toObject();
      console.log(temp2);
      console.log({ "data": "help" });
      temp.push(temp2);
    }
    res.status(200).json({ message: "Success", jobs: temp });
  } catch (error) {
    console.log("Went south")
    res.status(500).send(error);
  }
});
// Get a job by ID
router.get('/:id', async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) {
      return res.status(404).json();
    }
    res.send(job);
  } catch (error) {
    res.status(500).json(error);
  }
});

// Update a job by ID
router.patch('/:id', async (req, res) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = ['title', 'description', 'category', 'type', 'job_posted_date', 'job_expiry_date', 'company_id', 'location', 'skills', 'salary', 'job_applications'];
  const isValidOperation = updates.every((update) => allowedUpdates.includes(update));

  if (!isValidOperation) {
    return res.status(400).json({ error: 'Invalid updates!' });
  }
  try {
    const job = await Job.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!job) {
      return res.status(404).json();
    }
    res.send(job);
  } catch (error) {
    res.status(400).json(error);
  }
});
// Delete a job by ID
router.delete('/:id', async (req, res) => {
  try {
    const job = await Job.findByIdAndDelete(req.params.id);
    if (!job) {
      return res.status(404).send();
    }
    res.status(200).json(job);
  } catch (error) {
    res.status(500).json(error);
  }
});

module.exports = router;