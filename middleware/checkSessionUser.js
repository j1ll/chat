
const {CustomSession} = require('../models/customSession');
const {User} = require('../models/user');
const async = require('async');
const getAnonUser = require('../models/getAnonUser');
const log  =  require('../lib/logger')(__filename, 'debug');



module.exports = function (req,res,next) {
  async.waterfall([
    cb=>User.findById(req.sssn.userId,cb),
    (user, cb) => {
      if(!user) getAnonUser(cb);
      else cb(null,user);
    }
    
  ], function (err,user) {
    if(err) {log.error(err); return next(err)}
    req.user = user;
    if(req.user.id !== req.sssn.userStrId){
      log.info(req.user.id);
      log.info(req.sssn.userStrId);
      req.sssn.set({userId:req.user._id});
      req.sssn.save();
    }
     next();
  })
  
};// получить или создать сессию
// получить и проверить юзера