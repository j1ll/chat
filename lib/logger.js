'use strict';
const winston = require('winston');
const fecha = require('fecha');
const colors = require('colors/safe');
const path = require('path');
const {inspect} = require('util');
const config = {
  levels: {
    fatal:0,
    error:1,
    warn:2,
    info:3,
    debug:4,
    trace:5,
  },
  colors: {
    fatal:'red bold bgBlack inverse',
    error:'red bold bgBlack',
    warn:'yellow bold bgBlack',
    info:'green bold bgBlack',
    debug:'cyan bold bgBlack',
    trace:'blue bold bgBlack',
  },
  mycolors: {
    fatal:  colors.red.bold.bgBlack.inverse,
    error:  colors.red.bold.bgBlack,
    warn:  colors.yellow.bold.bgBlack,
    info:  colors.green.bold.bgBlack,
    debug:  colors.cyan.bold.bgBlack,
    trace:  colors.blue.bold.bgBlack,
  },
  
};



let customFormats = {
  globalData: winston.format((info, opts) => Object.assign({},opts,info)),
  setTime: winston.format((info)=>{info.time=new Date(); return info}),
  logData: winston.format((info)=>{console.dir(info); return info}),
  addTrace: winston.format((info)=>{info.stack=(new Error()).stack; return info}),
  shortFileName:winston.format((info)=>{info.filename=path.relative(process.cwd(),info.filename); return info}),
  shortTime:winston.format((info)=>{info.time=fecha.format(info.time, 'HH:mm:ss.SSS ZZ'); return info}),
  setAlignSpace:winston.format((info)=>{info.align=(info.level.length===4)?" ":""; return info}),
  colorize:winston.format.printf((info)=>{
    let lineString = info.line?(colors.magenta(":"+info.line)):"";
    let metadataString = Object.keys(info.metadata).length>0?
      `\n${inspect(info.metadata,{colors: true, depth:1})}`:'';
    let coloredString =
      config.mycolors[info.level](info.level+info.align) + " " +
      colors.grey(info.time) + " " +
      "["+info.filename+lineString+"]\n"+
      inspect(info.message,{colors: true, depth:info.depth}) +
      metadataString ;
    return coloredString;
  }),
};


config.longestNameLength = Object.keys(config.levels).reduce((acc, value) => Math.max(acc,value.length),0);
winston.addColors(config.colors);



module.exports = function (filename=__filename,level='info'){
  return winston.createLogger({
    level: level||'info',
    levels:config.levels,
    transports: [ new winston.transports.Console({
      stderrLevels:['fatal','error'],
      format: winston.format.combine(
        customFormats.globalData({filename, depth:1}),
        customFormats.setTime(),
        winston.format.metadata({ fillExcept: ['message', 'level', 'time', 'filename', 'line', 'stack', 'depth'] }),
        
        customFormats.shortFileName(),
        customFormats.shortTime(),
        customFormats.setAlignSpace(),
        customFormats.colorize
      )
      
      
    })]
  })
}; 
