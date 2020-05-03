'use strict'

const Master = require('../models/master')
const Flow = require('../models/flow')
const Activity = require('../models/activity')

var all = function(callback) {
  Master.find({}).exec(function(err, masters) {
    callback(masters)
  });
}

let flowsByMaster = async () => {
  let masters = await Master.find({}).exec()
  for (var i = 0; i < masters.length; i++) {
    let master = masters[i]
    let flows = await Flow.find({master: master._id}).exec()
    let firstStepCount = 0
    console.log('master', master.email);
    for (var j = 0; j < flows.length; j++) {
      let flow = flows[j]
      console.log('flow', flow.title);
      const match = {
        type: 'flow',
        status: 'start',
        'object._id': flow._id
      };
      const aggregatorOpts = [
        { $match: match },
        {
          $group: {
            _id: "$user.alias",
            count: { $sum: 1 }
          }
        }
      ]
      let count = await Activity.aggregate(aggregatorOpts).exec()
      console.log(count);
      // firstStepCount +=
    }
  }
  return {err: false}
}

module.exports = {
  all,
  flowsByMaster
}
