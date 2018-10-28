"use strict";
exports.mongoose = {
  host: '127.0.0.1',
  port: '27017',
  dbName: 'forum',
  get uri(){
    return `mongodb://${this.host}:${this.port}/${this.dbName}`;
  }
};

/*
* 
* exports.mongo={
  uri: 'mongodb://localhost/board',
  options:{
    keepAlive: true
  }
};
* 
* */
exports.port =  process.env.PORT || 3000;