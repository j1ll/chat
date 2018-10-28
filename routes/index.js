let express = require('express');
let path = require('path');
let util = require('util');
let router = express.Router();
let httpError = require('http-errors');
const config = require('../config');
let mongoose = require('mongoose');
var bodyParser = require('body-parser');
mongoose.connect(config.mongoose.uri);
const log = require('../lib/logger')(__filename, 'debug');
const async = require('async');
const cookie = require('cookie');
const {User} = require('../models/user');
const getAnonUser = require('../models/getAnonUser');
// router.use(require('serve-favicon')(faviconpath)),


router.use(
  require('morgan')('dev'),  
  express.json(),
  express.urlencoded({ extended: false }),
  (require('multer')()).array("avatar"),
  require('cookie-parser')("asdasd666"),
  function (req,res,next) {
    next();
  },
  require('../middleware/getCustomSession'),
  require('../middleware/checkSessionUser'),
  function (req,res,next) {
    next();
  },
  function (req,res,next) {
    req.userId=res.locals.userId=req.sssn.userId||null;
    req.userName=res.locals.userName=req.user.username;
    
    next();
  },
  
  express.static(path.join(__dirname, '../public'))
); 


/* GET home page. */


router.get('/login', (req, res, next)=>res.render('login'));
router.get('/storagetest', (req, res, next)=>res.render('storagetest'));
router.get('/react', (req, res, next)=>res.render('react'));

router.post('/login', function(req, res, next){
  var {username, password} = req.body;
  log.debug(username, {line:55});
  
  async.waterfall([
    cb=>{User.authorize(req.body.username, req.body.password,cb)},
    (user,cb)=>{
      req.user = user;log.debug(user);
      req.sssn.set({userId: user._id});
      req.sssn.save(cb);
    },
  ], function(err, session){
    if(err) return next(err);
  
    let io = req.app.get('io');
    req.userId=res.locals.userId=session.userId;
    req.userName=res.locals.userName=req.user.username;
    let data = {sid:session.id, userId: session.userStrId, username:req.user.username};
    
    res.send(username)
  })
});
router.post('/logout', function(req,res,next){
  async.waterfall([
    cb=>getAnonUser(cb),
    (anonUser,cb)=>{
      req.user = anonUser;
      log.info("got anon user");
      log.info(anonUser, {line:77});
      req.sssn.set({userId: anonUser._id});
      req.sssn.save(cb);
  }
  ],function (err,session) {
    if(err) {log.error(err); next(err)}
    log.info(session, {line:83});
    let io = req.app.get('io');
    req.userId=res.locals.userId=session.userId;
    req.userName=res.locals.userName=req.user.username;
    let data = {sid:session.id, userId: session.userStrId, username:req.user.username};
    res.redirect('/');
  });
  
});

router.get('/chat', function(req, res, next){
  // if (!req.session.user) return next(httpError(401, "Вы не авторизованы"));
  res.render('chat');
});
router.get('/', function(req, res, next) {res.render('frontpage'/*, { title: 'Express' } */);});
router.use('/api', require('./api'));
router.use('/posts', require('./posts'));
// router.use('/users', require('./users'));
router.get('/forbidden', function(req, res, next) {next(httpError(403));});
router.use(function(req, res, next) {next(httpError(404));});
module.exports = router;
