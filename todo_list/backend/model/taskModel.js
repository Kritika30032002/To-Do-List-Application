// models/taskModel.js
const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  text: String,
//   completed: Boolean,
  dueDate: String,
  email:String,

  category : String
  // You can also associate tasks with users if needed
  // user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
});

module.exports = mongoose.model('Task', taskSchema);












