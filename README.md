# ElecPen

[![Build Status](https://travis-ci.org/leozdgao/elecpen.svg?branch=master)](https://travis-ci.org/leozdgao/elecpen)
[![npm version](https://badge.fury.io/js/elecpen.svg)](https://badge.fury.io/js/elecpen)

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

## Example

You can you a set of default logger:

```js
// use default logger
var opts = {
  infoFile: 'info.log',  // record info and verbose
  errFile: 'err.log', // record error and warning
  logToConsole: true,
  timestamp: true, // default to true
  append: true // default to true
};
var http = requrie('http');
var logger = require('elecpen').defaultLogger(opts);

http.createServer(function(req, res) {
  logger.info('Recieve a request. Path: %s', req.path);
  res.end('Hello world.');
})
.listen(4000, function() {
  logger.info('Server listening...');
});
```

Or create you own logger:
```js
var createLogger = require('elecpen')
var log = createLogger(stdout, 'Message')
log('Hello World!')
```
