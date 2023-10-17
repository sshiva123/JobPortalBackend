const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const message = new Schema({
  conversationId:{type:String,required:true},
  sender: { type: String, required: true },
  content: { type: String, },
  date: { type: Date, default: Date.now },
},{timestamps:true});

const messageSchema = mongoose.model('Message', message);

module.exports = messageSchema;