const router = require('express').Router();
// const users = require('../controllers/users');
const {User} = require('../models/user');
let httpError = require('http-errors');
// const log = require('../../lib/log');

router.get('/users', function (req,res,next) {
  User.find({},(err,users)=>err?next(err):res.json(users));
});
router.get('/users/:name', function (req,res,next) {
  User.findOne({"username": req.params.name}, (err,user)=>{
    if (err) return next(err);
    // if (!user) return next(httpError(404, `${User.modelName} ${req.params.name} Not Found`));
    res.json(user);
  });
});
module.exports=router;