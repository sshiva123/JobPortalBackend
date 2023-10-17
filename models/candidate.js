const mongoose=require('mongoose');

const CandidateSchema=mongoose.Schema({
    "name" :{type:String,required:true},
    "gender":{type:String},
    "accountType":{type:String,required:true},
    "email" : {type:String,required:true},
    "password":{type:String},
    "phone" : {type:String,required:true},
    "skills":[
      {"name":{type:String},"skills":[{type:String}]}
    ],
    "resume":{type:String},
    "location":{
            "country":String,
    },
    "savedJobs":[{
      type:String,
           
    }],
    "appliedJobs":[{
      type:String,
      
    }],
    "experience": [{
        "title": String,
        "years": String,
        
      }],
      "education": [{
        "degree": String,
        "obtained":String
      }],
})
module.exports=mongoose.model('Candidate',CandidateSchema);