const {User} = require('../models/user');
const {CustomSession} = require('../models/customSession');
const async = require('async');


module.exports = function (sid,callback) {
  function getSessionFromSid(cb) {
    if(!sid) return cb(new Error("No sid provided"));
    CustomSession.findById(sid, cb);
  }
  function getUserFromSession(session,cb) {
    if(!session) return cb(new Error("Expired session"));
    if(!session.userId) return cb(new Error("No user in session")); //такого не должно быть
    User.findById(session.userId,cb);
  }
  function getUsernameFromUser(user,cb) {
    if(!user) return cb(new Error("No such user"));
    if(!user.username) return cb(new Error("User without username")); //такого не должно быть
    cb(null,user.username);
  }
  async.waterfall([
    getSessionFromSid,
    getUserFromSession,
    getUsernameFromUser
  ], callback);
};