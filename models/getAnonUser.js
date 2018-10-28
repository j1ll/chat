const {User} = require('./user');
const log  =  require('../lib/logger')(__filename, 'debug');

const async = require('async');

module.exports = function (callback) {
  async.waterfall([
    cb=> User.findOne({username: 'anon'},cb),
    (anonUser, cb)=> {
      if (!anonUser) {
        log.warn("No anon user! Creating anon user...");
        let anon = new User({username: 'anon',password: ''});
        anon.save(cb)
      } else cb (null, anonUser);
    }
  ], callback)
};
