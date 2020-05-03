const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let taskSchema = new Schema({
  name: {type: String, required: true},
  status: {type: String, enum: ['rungging', 'done', 'fail'], required: true},
}, {
  timestamps: true
});

module.exports = mongoose.model('task', taskSchema);
