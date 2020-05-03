const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let taskSchema = new Schema({
  version: {type: String, required: true, unique : true},
  file: {type: String, required: true},
}, {
  timestamps: true
});

module.exports = mongoose.model('pixel', taskSchema);
