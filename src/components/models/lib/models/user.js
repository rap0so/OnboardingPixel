const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let userSchema = new Schema({
  alias: {type: String, required: true},
  master: {type: Schema.Types.ObjectId, ref: 'master', required: true},
  name: String,
  email: String,
  custom_fields: {type: Schema.Types.Mixed},
  history: [{type: Schema.Types.Mixed}],
  currentStep: {type: Schema.Types.Mixed},
  currentFlow: {type: Schema.Types.Mixed},
  host: String,
  location: {type: Schema.Types.Mixed},
  navigator: {type: Schema.Types.Mixed}
}, {
  timestamps: true
});

module.exports = mongoose.model('user', userSchema);
