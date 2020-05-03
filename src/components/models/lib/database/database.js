var fs = require('fs');
const config = require('config');
const mongoose = require('mongoose');
var Rollbar = require('rollbar');
var rollbar = new Rollbar(config.rollbar.token);

var databaseDsn = config.database.driver + '://' + config.database.host + '/' + config.database.database;
// mongoose.Promise = Promise;
mongoose.Promise = require('bluebird');
mongoose.plugin(require('./findOneOrThrow'));
var connect = mongoose.connect(databaseDsn, {
  useMongoClient: true
});

// mongoose.createConnection(databaseDsn)

connect.then(() => {
  var models_path = __dirname + '/../models';

  fs.readdirSync(models_path).forEach(function (file) {
    require(models_path+'/'+file);
  });
}).catch(err => {
  console.error(err);
  rollbar.error(err);
  process.exit(1);
})
