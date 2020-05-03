const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// function defaultValidator(value) {
//   // `this` is the mongoose document
//   return this.startDate <= value;
// }

const customFieldSchema = new Schema({
  master: {type: Schema.Types.ObjectId, ref: 'master', required: true},
  name: {type: String, required: true},
  tag: {type: String, required: true},
  type: {type: String, enum: ['Text', 'Enum', 'Integer'], required: true},
  enum: [String],
  default: String
}, {
  timestamps: true
});

module.exports = mongoose.model('custom_field', customFieldSchema);
