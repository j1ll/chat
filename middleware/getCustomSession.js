
const {CustomSession} = require('../models/customSession');
const async = require('async');
const {User} = require('../models/user');
var {ObjectID} = require('mongodb');
const getAnonUser = require('../models/getAnonUser');
const log  =  require('../lib/logger')(__filename, 'debug');
module.exports = function (req,res,next) {
  async.waterfall([
    cb=>{
      if(!req.signedCookies.sid2) cb(null,null);
      else CustomSession.findById(req.signedCookies.sid2, cb)
    },
    (session,cb)=>{
      if(!session){
        session = new CustomSession();
        log.debug(session.userId);
        log.debug(session.id);
        console.dir(session.userId.inspect);
        res.cookie('sid2',session.id,{
          path:'/',
          secure: false,
          httpOnly: true,
          signed: true
        });
      }else{
        session.set({expires: new Date(Date.now()+(1000*60*60*24*7))})
        
      }
      session.save(cb);
    }
  ], function (err,session) {
    if(err) {log.error(err); return next(err)}
    req.sssn = session; next();
  })
  
};// получить или создать сессию
// получить и проверить юзера