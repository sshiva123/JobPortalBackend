const mongoose=require('mongoose');

const RecruiterSchema=mongoose.Schema({
    "name" :{type:String,required:true},
    "email" : {type:String,required:true},
    "accountType":{type:String,required:true},
    "password":{type:String},
    "phone" : {type:Number,required:true},
    "location":{
        "country":String,
    },
    "company":{type:String},
    "displayPicture":{type:String,default:"https://inkbotdesign.com/wp-content/uploads/2012/09/Google-Logo-Design.jpg"}
   
    
})
module.exports=mongoose.model('Recruiter',RecruiterSchema);