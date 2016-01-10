var assert = require('assert')
var fs = require('fs')
var elecpen = require('../src')

describe('Test actions of the logger.', function() {
  var logger, logger2

  var infoFile = 'info.test.log'
  var opts = {
    infoFile: infoFile
  }

  before(function() {
    logger = elecpen.defaultLogger(opts)
    logger2 = elecpen.defaultLogger(opts)
  })
  after(function(done) {
    fs.unlink('info.test.log', done)
  })

  it('Should create a file', function(done) {
    fs.exists(infoFile, function(exist) {
      assert.equal(exist, true)
      done()
    })
  })

  it('Should log correct entry.', function(done) {
    var expect = /^\[Info\] (.*?) Hello world(?:\n+|$)/m
    logger.info('Hello world')
    fs.readFile(infoFile, { encoding: 'utf-8' }, function(err, result) {
      var match = result.match(expect)
      assert.notEqual(match, null)
      assert.equal(isNaN(Date.parse(match[1])), false)
      done(err)
    })
  })

  it('Should append to an existed file.', function(done) {
    logger2.info('Hello world')
    logger2.info('Hello world')

    fs.readFile(infoFile, { encoding: 'utf-8' }, function(err, result) {
      var lines = result.split('\n')
      assert.equal(lines.length, 3)
      done(err)
    })
  })
})
