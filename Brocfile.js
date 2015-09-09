var mergeTrees = require('broccoli-merge-trees')
var Funnel = require('broccoli-funnel')
var browserify = require('broccoli-fast-browserify')
var uglify = require('broccoli-uglify-js')
var jade = require('broccoli-jade')
var stylus = require('broccoli-stylus-single')
var autoprefixer = require('broccoli-autoprefixer')
var assetRev = require('broccoli-asset-rev')
var gzipFiles = require('broccoli-gzip')

var onProduction = process.env.NODE_ENV === 'production'
var onDevelopment = !onProduction

var app = 'client'

var js = browserify(new Funnel(app, { include: ['js/**/*.js']}), {
  browserify: {
    debug: onDevelopment
  },
  bundles: {
    'js/app.js': {
      transform: ['babelify'],
      entryPoints: ['js/index.js']
    }
  }
})

if (onProduction) js = uglify(js)

var css = stylus(
  [new Funnel(app, { include: ['css/**/*.styl']})],
  'css/index.styl',
  'css/app.css',
  { compress: onProduction }
)

css = autoprefixer(css)

var html = jade(new Funnel(app, { include: ['*.jade']}), {
  pretty: onDevelopment,
  data: {onDevelopment: onDevelopment}
})

var tree = mergeTrees([js, css, html])

if (onProduction) tree = assetRev(tree)

if (onProduction) tree = gzipFiles(tree, {
  extensions: ['js', 'css'],
  keepUncompressed: true
})

module.exports = tree
