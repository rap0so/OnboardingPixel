const config = require('config');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
var analiticsConnection = mongoose.createConnection(config.database.analitics);
const paginate = require('mongoose-paginate')

const userSchema = new Schema({
  alias: {type: String, required: true, index: true},
  name: String,
  email: String,
  user: {type: Schema.Types.ObjectId, ref: 'user'},
  userId: {type: String}
});

const activitySchema = new Schema({
  master: {type: Schema.Types.ObjectId, ref: 'master', required: true},
  user: userSchema,
  type: {type: String, enum: ['project', 'flow', 'step'], required: true},
  status: {type: String, enum: ['start', 'finished', 'canceled', 'startFlowByUrl', 'startFlowById', 'startFlowByCommandLine', 'startFlowByOnLoad','startFlowByJSON', 'startFlowByAssistant'], required: true},
  url: {type: String, required: false},
  view: {type: String, required: false},
  object: {type: Schema.Types.Mixed, required: true}
}, {
  timestamps: true
});

activitySchema.plugin(paginate)

module.exports = analiticsConnection.model('activity', activitySchema);
