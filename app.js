const express =require ('express');
const bodyParser=require('body-parser');
const cors = require('cors');
const bcrypt=require('bcrypt');
const mongoose = require('mongoose');
const Candidate=require('./models/candidate');
const Recruiter=require('./models/recruiter');
const Message=require('./models/message');
const Conversation=require('./models/conversation')
const app=express();   
const server = require('http').createServer(app);
server.listen(3030, function() {
  console.log(`Socket Listening on port ${3030}`);
});
const io = require('socket.io')(server);

require('dotenv/config');

//SOCKET CODE

let onlineUsers=[];
const addOnlineUser = (userld, socketId) => {
  // find the index of the object with the same userld in the onlineUsers array
  const index = onlineUsers.findIndex((user) => user.userld === userld);
  // if the index is not -1, it means the object exists
  if (index !== -1) {
    // replace the object with a new one with the updated socketId
    onlineUsers[index] = { userld, socketId };
  } else {
    // otherwise, push a new object to the onlineUsers array
    onlineUsers.push({ userld, socketId });
  }
  console.log(onlineUsers);
};
const removeOnlineUser=(socketId)=>{
  // use a filter method to create a new array without the object with the same userld
 onlineUsers = onlineUsers.filter((user) => user.socketId !== socketId);
 console.log("user disconnected"+socketId);
}
const getUser=(userId)=>{
  const user=onlineUsers.find(user=>user.userId==userId);
  return user;
}

io.on("connection",(socket)=>{
  //ON CONNECTION
  console.log("a user connected");
 
  // define a function to handle getOnline event
  const handleGetOnline = (userId) => {
    addOnlineUser(userId,socket.id);
  };
 
  // define a function to handle sendMessage event
  const handleSendMessage = async ({userId,receiverId,text,conversation})=>{
    console.log("someone trying to send message "+text)
    const receiver=getUser(receiverId);
    if (receiver) {
      console.log("receiverOnline and trying to send to receiver: " + text);
      const newMessage=new Message({conversationId:conversation,sender:userId,content:text});
      const saved=await newMessage.save().then(data=>{
        io.to(receiver).emit("newMessage",data);
        io.to(socket.id).emit("newMessage",data);
      })
    } else {
      console.log("receiver Offline and trying to send to receiver: " + text);
      const newMessage=new Message({conversationId:conversation,sender:userId,content:text});
      const saved=await newMessage.save().then(async data=>{
        const updateConvo=await Conversation.findOneAndUpdate({_id:conversation},{ $inc: { count: 1 } });
        console.log(data);
        io.to(socket.id).emit("newMessage",data);
      });
    }
  };
 const handleSelfMessage=async()=>{
  const newMessage=new Message({conversationId:'6463838d528c168ab4029939',sender:'6463833b528c168ab402992d',content:'Paise ki kami nhi h... kati chaiyo?'});
  const saved=await newMessage.save().then(async data=>{
    const updateConvo=await Conversation.findOneAndUpdate({_id:'6463838d528c168ab4029939'},{ $inc: { count: 1 } });
    console.log(data);
    io.to(socket.id).emit("newMessage",data);
  });
 }
  // register the listeners for getOnline and sendMessage events
  socket.on("getOnline",handleGetOnline);
  socket.on("sendMessage",handleSendMessage);
  socket.on("selfMessage",handleSelfMessage);

  // remove the listeners when the socket disconnects
  socket.on("disconnect",()=>{
    console.log("a user disconnected");
    socket.off("getOnline",handleGetOnline);
    socket.off("sendMessage",handleSendMessage);
    socket.off("selfMessage",handleSelfMessage);
  });
 });
 

//SOCKET CODE END

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
const conversationRoute=require('./routes/conversationRoute');
const messageRoute=require('./routes/messageRoute');
const conversation = require('./models/conversation');

app.use('/candidates',candidateRoute);
app.use('/jobs',jobRoute);
app.use('/recruiters',recruiterRoute);
app.use('/categories',categoriesRoute);
app.use('/conversation',conversationRoute);
app.use('/message',messageRoute);

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
          recruiter.password=null;
          res.send({user:recruiter,message:"Success"});
        } catch (error) {
          res.status(500).send({error:error,message:"Failed"});
        }
      }else{
        candidate.password=null;
        res.send({user:candidate,message:"Success"});
      }
      
    } catch (error) {
      res.status(500).send({error:error,message:"Failed"});
    }
  })
 
app.listen(3000,'0.0.0.0') ;