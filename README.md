# ElecPen  ![travis](https://travis-ci.org/leozdgao/logger.svg?branch=master)

We take logger as a function to receive a record and output to a stream, and `elecPen` is a simple logger creator.

## API

`elecPen(writable, prefix, dateFormat)`

|Param|Description|
|-----|-----------|
|writable|A writable stream for logging|
|prefix|The prefix of the record|
|dateFormat|Date format for logger or pass `true` to use the default format|

## Default logger

A set of logger is provided by a default logger creator which provide some useful logger like `info` or `error`.

### Options

|Option|Description|
|------|-----------|
|infoFile|File name for logging info and verbose|
|errFile|File name for logging error and warning|
|timestamp|Date format for logger or pass `true` to use the default format|
|append|If file exists, append new entries to it instead of truncating|

### Methods

- logger.verbose
- logger.info
- logger.warning
- logger.error

### Example

```javascript
var opts = {
  infoFile: 'info.log',  // record info and verbose
  errFile: 'err.log', // record error and warning
  logToConsole: true,
  timestamp: true, // default to true
  append: true // default to true
};
var http = requrie('http');
var logger = require('logger').createLogger(opts);

http.createServer(function(req, res) {
  logger.info('Recieve a request. Path: %s', req.path);
  res.end('Hello world.');
})
.listen(4000, function() {
  logger.info('Server listening...');
});
```
