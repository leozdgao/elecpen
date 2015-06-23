# ElecPen  ![travis](https://travis-ci.org/leozdgao/logger.svg?branch=master)

A simple logger

### Options

|Option|Description|
|------|-----------|
|infoFile|File name for logging info and verbose|
|errFile|File name for logging error and warning|
|logToConsole|Write to console too|
|timestamp|Add timestamp for an entry|
|append|If file exists, append new entries to it instead of truncating|

### Methods

- logger.verbose
- logger.info
- logger.warning
- logger.error

### How to use?

```
var opts = {
  infoFile: 'info.log',  // record info and verbose
  errFile: 'err.log', // record error and warning
  logToConsole: true,
  timestamp: true, // default to true
  append: true // default to true
};
var fs = requrie('http');
var logger = require('logger').createLogger(opts);

http.createServer(function(req, res) {
  logger.info('Recieve a request. Path: %s', req.path);
  res.end('Hello world.');
})
.listen(4000, function() {
  logger.info('Server listening...');
});
```
