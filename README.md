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

|Option|Type|Description|
|------|----|-----------|
|infoFile|string, function|File name for logging info and verbose|
|errFile|string, function|File name for logging error and warning|
|timestamp|string, boolean|Date format for logger or pass `true` to use the default format|
|append|boolean|If file exists, append new entries to it instead of truncating|

### Methods

- logger.verbose
- logger.info
- logger.warning
- logger.error

## Example

You can you a set of default logger:

```js
// use default logger
const opts = {
  infoFile: 'info.log',  // record info and verbose
  errFile: 'err.log', // record error and warning
  timestamp: true,
  append: true // default to true
}
const http = requrie('http')
const logger = require('elecpen').defaultLogger(opts)

http.createServer((req, res) => {
  logger.info('Recieve a request. Path: %s', req.path)
  res.end('Hello world.')
})
.listen(4000, _ => {
  logger.info('Server listening...')
})
```

Dynamic file name is supported, and it is useful to record log by separated file.

```js
const opts = {
  infoFile () {
    const now = new Date()
    return `log-${now.getFullYear()}-${now.getMonth() + 1}`
  },
  errFile: 'err.log'
}
const logger = require('elecpen').defaultLogger(opts)
logger.info('Hello World!')
```

Or create you own logger:

```js
const fs = require('fs')
const elecpen = require('elecpen')
const recorder = elecpen.streamRecorder()

const log = function (msg) {
  // dynamic stream
  const stream = recorder(
    _ => `log-${Date.now()}.log`,
    name => fs.createWriteStream(name, { flags: 'a' })
  )
  stream && elecpen(stream, 'Message', timestamp)(msg)
}
log('Hello World!')
```

## License

MIT
