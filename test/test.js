const assert = require('assert')
const fs = require('fs')
const elecpen = require('../src')

describe('Test actions of the logger.', _ => {
  let logger, logger2

  const infoFile = 'info.test.log'
  const opts = {
    infoFile
  }

  before(function () {
    logger = elecpen.defaultLogger(opts)
    logger2 = elecpen.defaultLogger(opts)
  })
  after(function (done) {
    fs.unlink('info.test.log', done)
  })

  it('Should create a file', done => {
    fs.exists(infoFile, exist => {
      assert.equal(exist, true)
      done()
    })
  })

  it('Should log correct entry.', done => {
    const expect = /^\[Info\] (.*?) Hello world(?:\n+|$)/m
    logger.info('Hello world')
    fs.readFile(infoFile, { encoding: 'utf-8' }, (err, result) => {
      const match = result.match(expect)
      assert.notEqual(match, null)
      assert.equal(isNaN(Date.parse(match[1])), false)
      done(err)
    })
  })

  it('Should append to an existed file.', done => {
    logger2.info('Hello world')
    logger2.info('Hello world')

    fs.readFile(infoFile, { encoding: 'utf-8' }, (err, result) => {
      const lines = result.split('\n')
      assert.equal(lines.length, 3)
      done(err)
    })
  })
})
