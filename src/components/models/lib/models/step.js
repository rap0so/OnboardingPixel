const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const elementSchema = new Schema({
  name: String,
  tagName: String,
  outerHTML: String,
  textContent: String,
  idHTML: String,
  nameHTML: String,
  iframe: {}
});

const messageSchema = new Schema({
  text: String,
  position: Number
});

const listModalSchema = new Schema({
  idFlow: String,
  titleFlow: String,
  order: Number
});

const stepSchema = new Schema({
  flow: {type: Schema.Types.ObjectId, ref: 'flow', required: true},
  title: {type: String},
  order: {type: Number, required: true},
  element: elementSchema,
  type: {type: String, enum: ['popover', 'modal', 'hotspot', 'video', 'notification'], required: true},
  placement: String,
  triggerMode: String,
  messages: [messageSchema],
  delay: Number,
  useFade: {type: Boolean, default: true},
  elementSelector: {type: String},
  properties: {
    btnNextMsg: {type: String, default: 'Próximo'},
    btnPreviousMsg: {type: String, default: 'Anterior'},
    introTxtModal: String,
    welcomeMessage: {type: String},
    nameAssistant: {type: String},
    imgAssistant: String,
    descriptionAssistant: String,
    buttonStartTxt: {type: String, default: 'Inicio'},
    integrateRdStation: {type: Boolean, default: false},
    colorTheme: {type: String, default: '#12c1c7'},
    listModal: [listModalSchema],
    videoUrl: String,
    videoWidth: Number,
    videoHeight: Number,
    imgNotification: String,
    blockAutoScroll: {type: Boolean, default: false}
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('step', stepSchema);
