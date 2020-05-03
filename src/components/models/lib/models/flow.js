const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const activitySchema = new Schema({
  conversion: {type: Number, default: 0},
  totalRolled: {type: Number, default: 0}
});

const elementSchema = new Schema({
  name: String,
  tagName: String,
  outerHTML: String,
  textContent: String,
  idHTML: String,
  nameHTML: String,
  iframe: {}
});

const assistantSchema = new Schema({
  name: String,
  description: String,
  symbolColorTheme: {type: String, default: '#12c1c7'},
  place: {type: Number, default: '200'},
  showAssistant: {type: Boolean, default: false},
  optionsAssistant: {type: String, default: 'avatar'},
  imgAssistant: String,
});

const segmentationSchema = new Schema({
  customFieldId: {type: Schema.Types.ObjectId, ref: 'custom_field', required: true},
  logicalOperator: {type: String, required: true, enum: ['equal', 'not_equal', 'greater_than', 'greater_than_or_equal', 'less_than', 'less_than_or_equal', 'includes', 'not_includes', 'at_least_one_element', 'not_contains_any_element', 'contains_only_one']},
  value: {type: String, required: true}
});

const flowSchema = new Schema({
  master: {type: Schema.Types.ObjectId, ref: 'master', required: true},
  project: {type: Schema.Types.ObjectId, ref: 'project'},
  assistant: {type: assistantSchema, default: {}},
  title: {type: String, required: true},
  url: {type: String, required: true},
  order: {type: Number},
  properties: {type: Schema.Types.Mixed},
  triggerMode: {type: String, default: 'url'},
  themeId: {type: Schema.Types.ObjectId},
  activityInfos: {type: activitySchema, default: {
    conversion: 0,
    totalRolled: 0
  }},
  segmentationId: {type: Schema.Types.ObjectId, ref: 'segmentation'},
  audience:[segmentationSchema],
  logicalOperator: {type: String, enum: ['AND', 'OR', 'NOT'], default: 'AND'},
  element: elementSchema,
  rdStationToken: {type: String},
  targetURL: {type: String},
  active: {type: Boolean, default: false},
}, {
  timestamps: true,
  toJSON: { virtuals: true }
});

flowSchema.virtual('conversion').get(function() {
  return this._conversion;
});

flowSchema.virtual('conversion').set(function(conversion) {
  return this._conversion = conversion;
});

flowSchema.virtual('total').get(function() {
  return this._total;
});

flowSchema.virtual('total').set(function(total) {
  return this._total = total;
});

flowSchema.virtual('steps', {
  ref: 'step', // The model to use
  localField: '_id', // Find people where `localField`
  foreignField: 'flow', // is equal to `foreignField`
  // If `justOne` is true, 'members' will be a single doc as opposed to
  // an array. `justOne` is false by default.
  justOne: false
});

flowSchema.virtual('theme', {
  ref: 'theme',
  localField: 'themeId',
  foreignField: '_id',
  justOne: true
});

flowSchema.pre('save', function(next) {
  var self = this;
  const masterId = this.master;
  const Master = require('./master');

  Master.find({_id: masterId}).limit(1).then(masters => {
    let master = masters[0]
    if (!master) { next() }

    const RDStationToken = master.integrations && master.integrations.rdstation && master.integrations.rdstation.token
    if (RDStationToken !== undefined){
      self.properties = { rdStationToken: RDStationToken }
    }
    next()
  }).catch(err => {
    console.error(err);
    next(err)
  })
});

flowSchema.set('toObject', {
  getters: true
});

module.exports = mongoose.model('flow', flowSchema);
