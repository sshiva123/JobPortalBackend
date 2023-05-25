const mongoose=require('mongoose');

const CandidateSchema=mongoose.Schema({
    "name" :{type:String,required:true},
    "gender":{type:String},
    "accountType":{type:String,required:true},
    "email" : {type:String,required:true},
    "password":{type:String},
    "phone" : {type:String,required:true},
    "skills":[
      {"name":{type:String,unique:true},"skills":[{type:String,unique:true}]}
    ],
    "resume":{type:String},
    "location":{
            "country":String,
    },
    "experience": [{
        "title": String,
        "company": String,
        "fromDate": Date,
        "toDate": Date,
        "description": String
      }],
      "education": [{
        "degree": String,
        "fieldOfStudy": String,
        "fromDate": Date,
        "toDate": Date,
        "description": String
      }],
})
module.exports=mongoose.model('Candidate',CandidateSchema);