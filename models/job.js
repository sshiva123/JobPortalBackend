const mongoose=require('mongoose');

const JobSchema=mongoose.Schema({
    "title" :{type:String,required:true,minlength:1,maxlength:100},
    "description":{type:String,required:true,maxlength:2000},
    "type":{type:String},
    "job_posted_date" : {type:Date},
    "job_expiry_date":{type:Date},
    "company_id":{type:String},
    "location":{
            "country":String,        
    },
    "category":{type:String,default:'Other'},
    "designation":{type:String},
    "skills":[{"name":{type:String},"skills":[{type:String }]}],
    "benefits":[{type:String}],
    "salary":{
        "currency":String,
        "value":Number
    },
    "job_applications": [{
        "applicant_id":String,
        "description":String,
        "submission_date":{type:Date,default:Date.now()},
        "application_status":{type:String,default:'Pending'}
      }],
      "jobViews":{type:Number}
})
module.exports=mongoose.model('Job',JobSchema);