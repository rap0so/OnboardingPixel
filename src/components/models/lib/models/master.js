const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const _ = require('lodash');

const mixpanelSchema = new Schema({
  token: String
})

const integrationsSchema = new Schema({
  mixpanel: mixpanelSchema
})

const masterSchema = new Schema({
  email: {type: String, required: true},
  password: {type: String, required: true},
  paymentToken: String,
  userAppToken: String,
  pixelVersion: String,
  firstName: String,
  lastName: String,
  bacon: String,
  publicToken: String,
  language: {type: String, default: 'pt-br'},
  active: {type: Boolean, required: true, default: true},
  integrations: integrationsSchema
}, {
  timestamps: true
});

/**
 * O que isso faz?!?!
 * @returns {{}}
 */
masterSchema.methods.simple = function () {
  let doc = _.cloneDeep(this.toObject());
  return _.omit(doc, ['password', 'paymentToken'])
};

masterSchema.methods.findPixelFile = function (callback) {
  const Pixel = require('./pixel');
  Pixel.findOne({version: this.pixelVersion}).then(pixel => {
    callback(null, pixel.file);
  }).catch(err => {
    callback(err);
  })
}

module.exports = mongoose.model('master', masterSchema);
