const wreq = require('koa-watchify')
const browserify = require('browserify')
const watchify = require('watchify')
const path = require('path')

const src = path.resolve(__dirname, '../../client/js/index.js')
const dest = 'app.js'

var bundle = browserify({
  entries: [src],
  outfile: dest,
  fullPaths: true,
  packageCache: {},
  cache: {}
})

if ('development' == process.env.NODE_ENV) {
  bundle = watchify(bundle)
}

module.exports = wreq(bundle)
