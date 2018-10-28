const logger = require("../lib/logger");
const log = logger(__filename, 'trace');
let testObj={asfsd:55, set: new Set([4,5,6])};


console.log("log.fatal(object):");
log.fatal(testObj);
console.log("");


console.log("log.error(string)");
log.error("error string");
console.log("");

console.log("log.log({level:'warn', message: 'string'})");
log.log({level:'warn', message: 'string'});
console.log("");

console.log("log.log({level:'info', message: 'object'})");
log.log({level:'info', message: testObj});
console.log("");


console.log("log.log({level:'debug', message: 'object',asdsad: 'dsfsdf'})");
log.log({level:'debug', message: testObj, asdsad: "dsfsdf"});
console.log("");



console.log("log.trace()");
log.trace(testObj,{line:30});
console.log("");
