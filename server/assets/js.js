const wreq = require('koa-watchify')
const browserify = require('browserify')
const watchify = require('watchify')
const path = require('path')

var bundle = browserify({
  entries: [path.resolve(__dirname, '../../client/app.js')],
  fullPaths: true,
  packageCache: {},
  cache: {}
})

if ('development' == process.env.NODE_ENV) bundle = watchify(bundle)

module.exports = wreq(bundle)
