import fs from 'fs'
import moment from 'moment'
import chalk from 'chalk'
import util from 'util'

const debug = require('debug')('elecpen')

function isFunction (v) {
  return typeof v == 'function'
}

/**
 * Main method for create logger. The logger is just a function to recieve
 * the record and write to a stream.
 *
 * @param  {Writable} writable A writable stream for logging
 * @param  {string} prefix    The prefix to write
 * @param  {string | bool} date      The date format
 * @return {function} A function use like `console.log`
 */
function createLogger (writable, prefix, dateFormat) {
  if (!(writable && typeof writable.write === 'function')) {
    throw Error("The logger expected a writable stream.")
  }

  let pre = `[${prefix}]`
  // default timestamp format
  if (dateFormat === true) dateFormat = 'YYYY-MM-DD HH:mm:ss'
  if (typeof dateFormat === 'string') {
    pre += ` ${moment().format(dateFormat)}`
  }

  return msg => {
    writable.write(`${pre} ${msg}\n`)
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
    timestamp = true // string for a date format or pass true to use default format
  } = opts

  const flag = append ? 'a' : 'w'
  const infoStream = infoFile && fs.createWriteStream(infoFile, { flags: flag })
  const errStream = errFile && fs.createWriteStream(errFile, { flags: flag })

  const infoRecorder = streamRecorder()
  const errRecorder = streamRecorder()

  return {
    verbose () {
      const stream = infoRecorder(infoFile, name => fs.createWriteStream(name, { flags: flag }))
      stream && createLogger(stream, 'Verbose', timestamp).apply(this, arguments)
    },
    info () {
      const stream = infoRecorder(infoFile, name => fs.createWriteStream(name, { flags: flag }))
      stream && createLogger(stream, 'Info', timestamp).apply(this, arguments)
    },
    warning () {
      const stream = errRecorder(errFile, name => fs.createWriteStream(name, { flags: flag }))
      stream && createLogger(stream, 'Warning', timestamp).apply(this, arguments)
    },
    error () {
      const stream = errRecorder(errFile, name => fs.createWriteStream(name, { flags: flag }))
      stream && createLogger(stream, 'Error', timestamp).apply(this, arguments)
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
