const express =require ('express');
const bodyParser=require('body-parser');
const cors = require('cors');
const bcrypt=require('bcrypt');
const mongoose = require('mongoose');
const Candidate=require('./models/candidate');
const Recruiter=require('./models/recruiter');

const app=express();   
require('dotenv/config');




var mongoDB = 'mongodb://127.0.0.1:27017/JobPortal';
mongoose.connect(mongoDB, { useNewUrlParser: true }).then(() => console.log('Connected to MongoDB')).catch((error) => console.error(error));
 //Get the default connection
 var db = mongoose.connection;
 //Bind connection to error event (to get notification of connection errors)
 db.on('error', console.error.bind(console, 'MongoDB connection error:'));
 db.on('error', console.error.bind(console, 'MongoDB connection error:'));
 app.use(bodyParser.json(),cors())
//Routes
app.get('/',async(req,res)=>{
    res.send('Home Page');
}
);
const candidateRoute=require('./routes/candidateRoute');
const jobRoute=require('./routes/jobRoute');
const recruiterRoute=require('./routes/recruiterRoute');
const categoriesRoute=require('./routes/categoriesRoute');

app.use('/candidates',candidateRoute);
app.use('/jobs',jobRoute);
app.use('/recruiters',recruiterRoute);
app.use('/categories',categoriesRoute);

// Login route
app.post('/login', async (req, res) => {
    const { email, password } = req.body;
  
    try {
      // Check if user exists in User schema
      let user = await Candidate.findOne({ email });
      if (!user) {
        // Check if user exists in Company schema
        let company = await Recruiter.findOne({ email });
        if (!company) {
          return res.status(400).json({ message: 'Invalid credentials' });
        }
        user = company;
      }
      // Check password
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).json({ message: 'Invalid credentials' });
      }
  
      // Return _id and success message
      res.status(200).json({ user:user, message: 'Logged in successfully' });
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error');
    }
  });
  app.get('/detail/:id',async(req,res)=>{
    try {
      const candidate = await Candidate.findById(req.params.id);
      if (!candidate) {
        try {
          const recruiter = await Recruiter.findById(req.params.id);
          if (!recruiter) {
            return res.status(404).send({message:"Not Found"});
          }
          res.send({user:recruiter,message:"Success"});
        } catch (error) {
          res.status(500).send({error:error,message:"Failed"});
        }
      }else{
        res.send({user:candidate,message:"Success"});
      }
      
    } catch (error) {
      res.status(500).send({error:error,message:"Failed"});
    }
  })

app.listen(3000,'0.0.0.0') ;