const express = require('express');
const router = express.Router();
const Job = require('../models/job');
const Recruiter=require('../models/recruiter')
const Candidate=require('../models/candidate')
//update indexes after your update shema():
//Coz apparantly mongoose doesnot do it automatically
//Job.syncIndexes();

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
    const jobs = await Job.find().sort({ jobViews: -1 }).limit(6);
    let temp = [];
    for (let job of jobs) {
      let poster = await Recruiter.findOne({ _id: job.company_id }).exec();
      let temp2=job.toObject();
      poster.password='';
      temp2.companyData = poster.toObject();
      temp.push(temp2);
    }
    res.status(200).json({ message: "Success", jobs: temp });
  } catch (error) {
    console.log("Went south")
    res.status(500).send(error);
  }
});
//Recommended jobs per account
const debugSkills=[{name:'Software Development',skills:['Java','React.js','Node.js']},{name:'Advertising and Marketing',skills:['Java','React.js','Node.js']}]
router.get('/recommended/:id',async(req,res)=>{
 
    const requester= await Candidate.findOne({_id:req.params.id})
  
    let matchingSkills=await  Job.find({ 'skills.name': { $in:  requester.skills.map(skill => skill.name) }}).limit(10);
   if (matchingSkills.length<10){
    const jobs = await Job.find({'_id':{$nin:matchingSkills.map(matchingJob=>matchingJob._id)}}).sort({ jobViews: -1 }).limit(10-matchingSkills.length);
    matchingSkills=[...matchingSkills,...jobs];
   }
   let temp=[];
   for (let jobn of matchingSkills) {
    let poster = await Recruiter.findOne({ _id: jobn.company_id }).exec();
    let temp2=jobn.toObject();
    poster.password='';
    temp2.companyData =await poster.toObject();
    temp.push(temp2);
  }
   console.log(await matchingSkills)
    res.status(200).json({message:'Success',jobs:temp});
   
  }
  
)
//get recent jobs
router.get('/recent', async (req, res) => {
  try {
    const jobs = await Job.find().sort({ _id: -1 }).limit(6);
    let temp = [];
    for (let job of jobs) {
      let poster = await Recruiter.findOne({ _id: job.company_id }).exec();
      let temp2=job.toObject();
      poster.password='';
      temp2.companyData = poster.toObject();
      temp.push(temp2);
    }
    res.status(200).json({ message: "Success", jobs: temp });
  } catch (error) {
    console.log("Went south")
    res.status(500).send(error);
  }
});
//get jobs without valid poster
router.get('/posterFilter', async (req, res) => {
  try {
    const jobs = await Job.find()
    let temp = [];
    for (let job of jobs) {
      let poster = await Recruiter.findOne({ _id: job.company_id }).exec();
      if(!poster){
        temp.push(job)
      }
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
//get saved job  per canddate
router.get('/savedJobs/:id',async (req,res)=>{
  let user;
  try{
  user=await Candidate.findById(req.params.id);
  }catch(error){
    return res.status(404).json({message:'Not found'})
  }

  let jobDetail;
  let jobs=[]
  if(user && user.savedJobs[0]){
    
    await Promise.all(user.savedJobs.map(async job=>{
      jobDetail=await Job.findById(job);
      
      jobs.push(await jobDetail);
    }))
    let temp=[];
    for (let jobn of jobs) {
     let poster = await Recruiter.findOne({ _id: jobn.company_id }).exec();
     let temp2=jobn.toObject();
     poster.password='';
     temp2.companyData =await poster.toObject();
     temp.push(temp2);
   }
    return res.status(200).json({jobs:temp,message:'Success'})
  }
  else{
   return res.status(404).json({jobs:[],message:"Not found"})
  }
})
//get applied job per candidate
router.get('/appliedJobs/:id',async (req,res)=>{
  let user;
  try{
  user=await Candidate.findById(req.params.id);
  }catch(error){
    return res.status(404).json({message:'Not found'})
  }
 
  let jobDetail;
  let jobs=[]
  if(user && user.appliedJobs[0]){
    
    await Promise.all(user.appliedJobs.map(async job=>{
      jobDetail=await Job.findById(job);
      
      jobs.push(await jobDetail);
    }))
    let temp=[];
    for (let jobn of jobs) {
     let poster = await Recruiter.findOne({ _id: jobn.company_id }).exec();
     let temp2=jobn.toObject();
     poster.password='';
     temp2.companyData =await poster.toObject();
     temp.push(temp2);
   }
    return res.status(200).json({jobs:temp,message:'Success'})
  }
  else{
   return res.status(404).json({jobs:[],message:"Not found"})
  }
})

//Candidate applies for a job:
router.post('/jobApply/:id',async(req,res)=>{
  let hasApplied=[];
  const appliedJob=await Job.findById(req.params.id);
  const appliedBy=await Candidate.findById(req.body.applicant_id);
  hasApplied=await appliedJob.job_applications.filter(application=>application.applicant_id==req.body.applicant_id);
  console.log(!hasApplied[0]);
  if(appliedJob && appliedBy && !hasApplied[0]){
    const job = await Job.findByIdAndUpdate(req.params.id,{$addToSet:{job_applications:req.body}}, { new: true, runValidators: true });  
    const user=await Candidate.findByIdAndUpdate(req.body.applicant_id,{$addToSet:{appliedJobs:req.params.id}})
    if(job&&user){
      return res.status(200).json({job:job,message:'Success'});
    }else{
      return res.status(500).json({message:'Something went wrong!'});
    }
  }else{
    console.log("yeta aaxa")
    return res.status(300).json({message:"Already applied"});
  }
  
})
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