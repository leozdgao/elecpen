import fs from 'fs'
import moment from 'moment'
import chalk from 'chalk'
import util from 'util'

const debug = require('debug')('elecpen')

function isFunction (v) {
  return typeof v == 'function'
}

function isDefined (v) {
  // filter `null` and `void 0`
  return v !== null
}

function isDev () {
  return process.env['NODE_ENV'] !== 'production'
}

/**
 * Main method for create logger. The logger is just a function to recieve
 * the record and write to a stream.
 *
 * @param  {Writable}       writable    A writable stream for logging
 * @param  {string}         prefix      The prefix to write
 * @param  {string | bool}  date        The date format
 * @return {function} A function use like `console.log`
 */
function createLogger (writables, prefix, dateFormat) {
  if (!Array.isArray(writables)) writables = [ writables ]

  writables = writables.filter(w => isDefined(w) && isFunction(w.write))

  let pre = `[${prefix}]`
  // default timestamp format
  if (dateFormat === true) dateFormat = 'YYYY-MM-DD HH:mm:ss'
  if (typeof dateFormat === 'string') {
    pre += ` ${moment().format(dateFormat)}`
  }

  return msg => {
    writables.forEach(w => w.write(`${pre} ${msg}\n`))
  }
}

/**
 * Construct a default logger, it can record the verbose, info , warning, error message and
 * write it to the file you specified.
 *
 * Options:
 *     infoFile: Path of the file for recording verbose and info message.
 *     errFile: Path of the file for recording warning and error message.
 *     append: Decide append or truncate the file if it exists. Default to be true.
 *     timestamp: Represents the date format or pass true to use default format.
 *
 * @param {object} opts - options
 * @returns {object} The logger
 */
function useDefaultLogger (opts) {
  const {
    infoFile, errFile,
    append = true,
    timestamp = true, // string for a date format or pass true to use default format
  } = opts

  // The value of `logToConsole` default to true in dev mode
  let logToConsole = opts.logToConsole
  if (isDev() && !isDefined(logToConsole)) {
    logToConsole = true
  }

  const flag = append ? 'a' : 'w'
  const infoStream = infoFile && fs.createWriteStream(infoFile, { flags: flag })
  const errStream = errFile && fs.createWriteStream(errFile, { flags: flag })

  const infoRecorder = streamRecorder()
  const errRecorder = streamRecorder()

  return {
    verbose () {
      let stream = infoRecorder(infoFile, name => fs.createWriteStream(name, { flags: flag }))
      if (logToConsole) stream = [ process.stdout, stream ]

      createLogger(stream, 'Verbose', timestamp).apply(this, arguments)
    },
    info () {
      let stream = infoRecorder(infoFile, name => fs.createWriteStream(name, { flags: flag }))
      if (logToConsole) stream = [ process.stdout, stream ]

      createLogger(stream, 'Info', timestamp).apply(this, arguments)
    },
    warning () {
      let stream = errRecorder(errFile, name => fs.createWriteStream(name, { flags: flag }))
      if (logToConsole) stream = [ process.stderr, stream ]

      createLogger(stream, 'Warning', timestamp).apply(this, arguments)
    },
    error () {
      let stream = errRecorder(errFile, name => fs.createWriteStream(name, { flags: flag }))
      if (logToConsole) stream = [ process.stderr, stream ]

      createLogger(stream, 'Error', timestamp).apply(this, arguments)
    }
  }
}

/**
 * Record the stream by key
 * @return {function} A function return stream
 */
function streamRecorder () {
  let lastKey, lastStream
  return (key, createStream) => {
    if (isFunction(key)) key = key.call()

    debug(`Recorder get key: ${key}`)

    if (key !== lastKey) {
      debug(`Recorder will return a new stream`)

      lastKey = key
      lastStream = createStream.call(null, key)
    }

    return lastStream
  }
}

createLogger.defaultLogger = useDefaultLogger
createLogger.streamRecorder = streamRecorder

module.exports = createLogger
