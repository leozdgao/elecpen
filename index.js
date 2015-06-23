var fs = require('fs');
var chalk = require('chalk');
var util = require('util');

/**
 * Construct a logger, it can record the verbose, info , warning, error message and
 * write it to the file you specified.
 *
 * Options:
 *     infoFile: Path of the file for recording verbose and info message.
 *     errFile: Path of the file for recording warning and error message.
 *     append: Decide append or truncate the file if it exists. Default to be true.
 *     timestamp: Output the timestamp or not. Default to be true.
 *     logToConsole: Record to console after write log.
 *
 * @param {Object} opts - options
 * @returns {Object} The logger
 */
exports.createLogger = function(opts) {
    var infoFile = opts.infoFile, // stream for info and verbose
        errFile = opts.errFile, // stream for error and warning
        append = typeof opts.append == 'boolean' ? opts.append : true, // append to existed file or not
        timestamp = typeof opts.append == 'boolean' ? opts.timestamp : true, // output timestamp or not
        logToConsole = !!opts.logToConsole;

    var flag = append ? 'a' : 'w',
        infoStream = infoFile && fs.createWriteStream(infoFile, { flags: flag }),
        errStream = errFile && fs.createWriteStream(errFile, { flags: flag }),
        logger = {};

    logger.verbose = function() {
        infoStream && log(infoStream, '[Verbose]', chalk.gray).apply(this, arguments);
    };
    logger.info = function() {
        infoStream && log(infoStream, '[Info]').apply(this, arguments);
    };
    logger.warning = function() {
        errStream && log(errStream, '[Warning]', chalk.yellow).apply(this, arguments);
    };
    logger.error = function() {
        errStream && log(errStream, '[Error]', chalk.red).apply(this, arguments);
    };

    function log(stream, prefix, decorator) {
        var msg = prefix + ' ' + (timestamp ? getCurrentDateString(): '') + ' ';
        return function () {
            var args = Array.prototype.slice.call(arguments),
                entry = util.format.apply(this, [].concat(msg, args));

            stream.write(entry + '\n');

            if(logToConsole) {
              console.log(typeof decorator == 'function' ? decorator(msg) : msg);
            }
        };
    }

    function getCurrentDateString() {
        return Date();
    }

    return logger;
}
