'use strict'
const Flow = require('../models/flow')
const Step = require('../models/step')
const CustomField = require('../models/custom_field')
const Regex = require('conpass-regex')
const _ = require('lodash')

let getResult = async function (_logicalOperator, audience, user) {
  let result =  _logicalOperator == 'AND' // Hack para saber se começa com true para and e false para or.
  let logicalOperator = _logicalOperator || 'AND'
  for (var i = 0; i < audience.length; i++) {
    let au = audience[i]
    var custom_field = await CustomField.findOne({_id: au.customFieldId}).exec()
    if (au.logicalOperator == 'equal') {
      let userTag = user.custom_fields[custom_field.name]
      if (userTag) {
        userTag = userTag.toString()
      }
      // console.log('custom_field', custom_field);
      // console.log('userTag', userTag);
      // console.log('au.value', au.value);
      // console.log('userTag == au.value', userTag == au.value.toString());
      // console.log('user.custom_fields', user.custom_fields);
      let internalRsult = userTag == au.value.toString()
      if (logicalOperator == 'AND') {
        result = internalRsult && result
      } else if(logicalOperator == 'OR') {
        result = internalRsult || result
      }
    }
  }
  return result
}

let applySegmentation = async function (flows, user) {
  let flowsToReturn = []
  user = user || {}
  for (var i = 0; i < flows.length; i++) {
    let flow = flows[i]
    let audience = flow.audience
    // TODO deve ser excluente?
    if (audience && audience.length > 0) {
      if(user.custom_fields) {
        let result = await getResult(flow.logicalOperator, audience, user)
        if(result) flowsToReturn.push(flow)
      }
    } else {
      flowsToReturn.push(flow)
    }
  }
  return flowsToReturn
}

let findByUrl = async function (master, url, user) {
  let flows = await Flow.find({master: master, triggerMode: 'url'}).exec()
  if (!flows) {
    return {success: false, message: `Failed to get flow with url: ${url}, see errors for more information`, errors: 'not flow for master'}
  }
  let selected = flows.filter(function(flow) {
    return new Regex(flow.url).test(url);
  })
  selected = await applySegmentation(selected, user)
  if(selected.length > 0) {
    if(!selected[0]) {
      return {success: false, message: `Failed to get flow steps with flow url: ${url}, see errors for more information`, errors: 'first flow not found'}
    }
    let flow = selected[0].toObject()
    let steps = await Step.find({flow: flow._id}).sort({ 'order': 1 }).exec()
    if (!steps) {
      return {success: false, message: `Failed to get flow steps with flow url: ${url}, see errors for more information`, errors: 'flow without steps'}
    }
    flow.steps = steps;
    return {success: true, data: flow}
  } else {
    return {success: false, message: `Failed to get flow steps with flow url: ${url}, see errors for more information`, errors: 'flows not found'}
  }
}

let findByTitle = async function (master, title, user) {
  let flows = await Flow.find({master: master, title: title}).exec()
  flows = await applySegmentation(flows, user)
  if (!flows[0]) {
    return {success: false, message: `Failed to get flow with title: ${title}, see errors for more information`, errors: 'flow not found'}
  }
  let flow = flows[0].toObject()
  let steps = await Step.find({flow: flow._id}).sort({ 'order': 1 }).exec()
  if (!steps) {
    return {success: false, message: `Failed to get flow and steps with flow title: ${title}, see errors for more information`, errors: 'flows without steps'}
  }
  flow.steps = steps
  return {success: true, data: flow}
}

let findByMaster = function (masterId, callback) {
  Flow.find({master: masterId}).exec((err, flows) => {
    callback(flows)
  })
}

module.exports = {
  findByUrl: findByUrl,
  findByTitle: findByTitle,
  findByMaster: findByMaster
}
