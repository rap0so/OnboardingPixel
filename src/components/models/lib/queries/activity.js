'use strict'
const Activity = require('../models/activity')
const Flow = require('../models/flow')
const Step = require('../models/step')
const Master = require('../models/master')
const FlowQueries = require('./flow')
const moment = require('moment')
const _ = require('lodash')
const bluebird = require('bluebird')
const mongoose = require('mongoose');

let updateConvertions = async () => {
  let masters = await Master.find({}).exec()
  let result = []
  for (var i = 0; i < masters.length; i++) {
    let master = masters[i]
    let updated = await updateConvertionByMaster(master._id)
    if(!updated) {
      result.push(master._id)
    }
  }
  return result
}

let updateConvertionByMaster = async (masterId) => {
  let flows = await Flow.find({master: masterId}).exec()
  if(flows.length == 0) return false
  for (var i = 0; i < flows.length; i++) {
    let flow = flows[i]
    let firstStepCount = await Activity.count({status: 'start', 'object._id': flow._id.toString()})
    let lastStepCount = await Activity.count({status: 'finished', 'object._id': flow._id.toString()})
    let conversion = (lastStepCount * 100) / firstStepCount
    flow.activityInfos = {
      conversion: (conversion || 0).toFixed(2),
      totalRolled: (firstStepCount || 0).toFixed(2)
    }
    let save = await flow.save()
  }
  return true
}

let agre = function(masterId, callback) {
  const aggregatorOpts = [{
    $group: {
      _id: "$object.alias",
      count: { $sum: 1 }
    }
  }]
  FlowQueries.findByMaster(masterId, flows => {
    console.log('flows', flows);
    if(flows.length === 0) {
      return callback(null)
    }
    let counter = flows.length
    flows.forEach(flow => {
      Activity.aggregate(aggregatorOpts).exec((err, activities) => {
        console.log(activities);
        console.log('counter', counter);
        counter--
        if (counter == 0) {
          callback(activities)
        }
      })
    })
  })
}

let findUsersByFlowId = function (params, callback_success, callback_error) {
  const flowId = params.flowId
  const startDate = params.startDate ? moment(params.startDate) : moment().subtract(1, 'month')
  const endDate = params.endDate ? moment(params.endDate) : moment()
  const userEmail = params.userEmail ? params.userEmail : null
  const usersAlias = params.usersAlias ? JSON.parse(params.usersAlias) : null

  const match = {
    type: 'flow',
    status: {$in:['start', 'startFlowByUrl', 'startFlowById', 'startFlowByCommandLine']},
    'object._id': params.flowId,
    'createdAt': {
      $gte: startDate.startOf('day').toDate(),
      $lte: endDate.endOf('day').toDate()
    },
  };

  if (userEmail) {
    match['$and'] = [
      { $or: [
        { 'user.name': { $regex: userEmail, $options: 'i' } },
        { 'user.email': { $regex: userEmail, $options: 'i' } }
      ] }
    ]
  }

  if (usersAlias) {
    match['$and'] = [
      { 'user.alias': { $in: usersAlias } }
    ]
  }

  const aggregationFilter = [
    { $match: match },
    { $sort: {'createAt': -1} },
    { $group: {
      _id: '$user.alias',
      users: { $push: "$$ROOT" },
    } },
  ]

  let getStepsData = Activity.aggregate(aggregationFilter).exec()
  getStepsData.then(users => {
    callback_success({success: true, data: users})
  }).catch(err => {
    callback_error({success: false, message: `Failed to get users, see errors for more information`, errors: err.errors || err.message})
  })
}

let findUserSteps = function (params, callback_success, callback_error) {

  const flowId = params.flowId
  const userAlias = params.userAlias
  const startDate = params.startDate || moment().subtract(1, 'month').format()
  const endDate = params.endDate || moment().format()

  let filters = {
    type: 'step',
    status: 'start',
    'user.alias': userAlias,
    'object.flow': flowId
  }

  Activity.find(filters).sort({'date': -1}).then(users => {
    callback_success({success: true, data: users})
  }).catch(err => {
    callback_error({success: false, message: `Failed to get users, see errors for more information`, errors: err.errors || err.message})
  })
}

//DEPRECATED
let findUserConvertions = async function (params) {
  const flowId = params.flowId
  const startDate = params.startDate ? moment(params.startDate) : moment().subtract(1, 'month')
  const endDate = params.endDate ? moment(params.endDate) : moment()

  var aggregationFilter = [
    {
      $match: {
        type: 'step',
        status: 'start',
        'object.flow': flowId,
        'createdAt': {
          $gte: startDate.startOf('day').toDate(),
          $lte: endDate.endOf('day').toDate()
        }
      },
    },
    {
      $sort: {'createdAt': -1}
    },
  ]

  let getConversionData = async () => {
    let newData = {}
    let steps = await Step.find({flow: flowId}).sort({order: 1}).exec();
    let activities = await Activity.aggregate(aggregationFilter).exec();
    newData.steps = steps.map(e => e.title || e.properties.introTxtModal)
    activities = activities.map(e => {
      delete e.object.messages;
      delete e.object.element;
      return e
    })
    newData.activities = activities
    return newData
  }

  let result = await getConversionData()

  return result
}

let countUserConvertionsPerStep = async (params) => {
  const flowId = params.flowId
  const startDate = params.startDate ? moment(params.startDate) : moment().subtract(1, 'month')
  const endDate = params.endDate ? moment(params.endDate) : moment()

  let getConversionData = Activity.aggregate([
    {
      $match: {
        master: mongoose.Types.ObjectId(params.master),
        type: 'step',
        status: 'start',
        'object.flow': flowId,
        'createdAt': {
          $gte: startDate.startOf('day').toDate(),
          $lte: endDate.endOf('day').toDate()
        }
      }
    },{
      $group:{
        _id: '$object._id',
        intro: {$last: '$object.properties.introTxtModal'},
        title: {$last: '$object.title'},
        order: {$last: '$object.order'},
        users: {
          $addToSet: '$user.alias'
        }
      }
    },{
      $group: {
        _id: '$_id',
        intro: {$last: '$intro'},
        title: {$last: '$title'},
        order: {$last: '$order'},
        count: {
          $sum: { $size: "$users"}
        }
      }
    }
  ]).allowDiskUse()

  let result = await getConversionData.exec()
  return result
}

let findUserConvertionsByStep = async (params) => {
  const flowId = params.flowId
  let stepId = params.stepId
  const startDate = params.startDate ? moment(params.startDate) : moment().subtract(1, 'month')
  const endDate = params.endDate ? moment(params.endDate) : moment()
  let size = params.size ? Number(params.size) : 15
  let page = params.page ? Number(params.page) : 1
  let offset = size*(page-1)

  let getConversionData = Activity.aggregate([
  {
    $match: {
      master: mongoose.Types.ObjectId(params.master),
      type: 'step',
      status: 'start',
      'object.flow': flowId,
      'object._id': stepId,
      'createdAt': {
        $gte: startDate.startOf('day').toDate(),
        $lte: endDate.endOf('day').toDate()
      }
    }
  },{
    $group: {
      _id: "$user.alias",
      user: 
      {
        $addToSet: "$user"
      }
    }
  },{
    $skip: offset
  },{
    $limit: size
  }]).allowDiskUse()

  let result = await getConversionData.exec();
  return result
}

function allDaysInRange (startDate, endDate) {
  var dates = []
  dates.push(moment(startDate))
  var currentDate = moment(startDate)
  while (currentDate < endDate) {
    currentDate = moment(currentDate).add(1, 'days')
    dates.push(currentDate)
  }
  return dates
}

let forChart = function(params, callback_success, callback_error) {

  const masterId = params.masterId
  const startDate = params.startDate ? moment(params.startDate) : moment().subtract(1, 'month')
  const endDate = params.endDate ? moment(params.endDate) : moment()

  let options = params

  // Predefined colors to be used with ChartJS
  let colors = ["#f5a623", "#9013fe", "#12c1c7", "#E91E63", "#2196F3", "#F44336", "#4CAF50", "#795548", "#607D8B", "#3F51B5"]

  let aggregationFilter = function(masterId, flow_id, startDate, endDate) {
    let filter = [
      {
        $match: {
          'object._id': flow_id.toString(),
          type: 'flow',
          status: {$in:['start', 'startFlowByUrl', 'startFlowById', 'startFlowByCommandLine']},
          'createdAt': {
            $gte: startDate.startOf('day').toDate(),
            $lte: endDate.endOf('day').toDate()
          }
        }
      },
      {
        $group: {
          _id: {
            day: { $dayOfMonth: '$createdAt' },
            month: { $month: '$createdAt' },
            year: { $year: '$createdAt' }
          },
          users: { $addToSet: '$user.alias' }
        }
      },
      {
        $sort: {'_id.day': 1}
      }
    ]
    return filter
  }

  let data = {}
  let dates = allDaysInRange(startDate, endDate)
  data.labels = _.map(dates, function (date) {
    return date.format('L')
  })

  Flow.find({master: masterId}).then(function(flows){
    bluebird.map(flows, function (flow, index) {

      var getPathActivities = Activity.aggregate(aggregationFilter(masterId, flow._id, startDate, endDate)).exec()
      return getPathActivities.then(function (activities) {
        var dataset = {}
        let color = colors[index]
        dataset.label = flow.title
        dataset.fill = false
        dataset.borderColor = color
        dataset.pointBorderColor = color
        dataset.pointBackgroundColor = "#fff"
        dataset.pointBorderWidth = 1
        dataset.pointHoverRadius = 5
        dataset.radius = 5
        dataset.backgroundColor = color

        dataset.data = _.map(dates, function (date) {
          var dateActivity = _.find(activities, function (search) {
            var searchDate = moment([search._id.year, search._id.month - 1, search._id.day])
            return date.isSame(searchDate, 'day')
          })
          return dateActivity ? dateActivity.users.length : 0
        })
        return dataset
      })
    }).then(function (datasets) {
      data.datasets = datasets
      callback_success({datasets: data, options: options})
    }).catch(function (err) {
      callback_error({success: false, message: `error-getPathsByProject::ActivityController`, errors: err.errors || err.message})
    })
  })

}

module.exports = { updateConvertions, updateConvertionByMaster, findUsersByFlowId, findUserSteps, findUserConvertions, forChart, agre, findUserConvertionsByStep, countUserConvertionsPerStep}
