const compose = require('koa-compose')

module.exports = compose([
  require('./views'),
  require('./styles'),
  require('./js')
])
