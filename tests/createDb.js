//db.customsessions.createIndex( { "expires": 1 }, { expireAfterSeconds: 0 } )

var mongoose = require('mongoose');var async = require('async');
mongoose.set('debug',true);
mongoose.connect('mongodb://127.0.0.1:27017/forum');
let log = require('../lib/logger')(__filename);
var db = mongoose.connection;
let opts = { validator: { $jsonSchema: {
  bsonType: "object",
  required: [ "_id", "username", "salt", "hashedPassword", "created"],
  properties: {
    username:{bsonType: 'string'},
    salt:{bsonType: 'string'},
    hashedPassword:{bsonType: 'string'},
    created:{bsonType: 'date'},//db.testsession.createIndex( { "expireAt": 1 }, { expireAfterSeconds: 0 } )
  
  }
}}};
async.series([
  open,
  dropDatabase,
  createCollections,
  requireModels,
  createUsers,
  getUsers
], function(err,res) {
  console.dir(res);
  if (err) log.error(err);
  mongoose.disconnect();
  process.exit(err ? 255 : 0);
});

function open(callback) {
  db.on('open', callback);
}

function dropDatabase(callback) {
  db.dropDatabase(callback);
}

function createCollections(callback){
  db.createCollection("users",opts, callback);
}

function requireModels(callback) {
  require('../models/user');
  
  async.each(db.modelNames(), function(modelName, callback) {
    db.model(modelName).ensureIndexes(callback);
  }, callback);
}

function createUsers(callback) {
  
  var users = [
    {username: 'Вася', password: 'supervasya'},
    {username: 'Петя', password: '123'},
    {username: 'name', password: 'pass'},
    {username: 'admin', password: 'thetruehero'},
    {username: 'asd', password: 'asd'},
    {username: 'anon', password: ''},
    // {username: 'fff', password: 'fiva'}
  ];
  
  async.each(users, function(userData, callback) {
    // var user = new mongoose.models.User(userData); old
    var user = new (db.model('User'))(userData);
    //user.save((err)=>{callback(err,user)}); new
    user.save(callback);
  }, callback);
}


function getUsers(callback) {
  // (db.model('User')).find().exec(callback)
  (db.collection('users')).find().toArray(callback)
}