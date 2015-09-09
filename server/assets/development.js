import compose from 'koa-compose'

export default compose([
  require('./polyfill'),
  require('koa-broccoli')()
])
