import fs from 'fs'
import moment from 'moment'
import chalk from 'chalk'
import util from 'util'

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

  return {
    verbose () {
      infoStream && createLogger(infoStream, 'Verbose', timestamp).apply(this, arguments)
    },
    info () {
      infoStream && createLogger(infoStream, 'Info', timestamp).apply(this, arguments)
    },
    warning () {
      errStream && createLogger(errStream, 'Warning', timestamp).apply(this, arguments)
    },
    error () {
      errStream && createLogger(errStream, 'Error', timestamp).apply(this, arguments)
    }
  }
}

createLogger.defaultLogger = useDefaultLogger

module.exports = createLogger
