const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const assistantSchema = new Schema({
  imgUrl: String,
  name: {type: String, required: true},
  description: String,
  place: Number,
  welcomeMessage: {type: String, required: true}
});

const projectSchema = new Schema({
  master: {type: Schema.Types.ObjectId, ref: 'master', required: true},
  title: {type: String, required: true},
  url: {type: String},
  assistant: {type: assistantSchema, required: false},
  properties: {
    showAssistant: {type: Boolean, default: true},
    colorTheme: {type: String, default: '#f19d13'},
    introTxtModal: String,
    btnNextMsg: String,
    btnPreviousMsg: String,
    btnEndMsg: String,
    btnNoContinue: String,
    btnYesContinue: String,
    titleEndFlow: String,
    textEndFlow: String,
    btnYesEndFlow: String,
    btnNoEndFlow: String
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('project', projectSchema);
