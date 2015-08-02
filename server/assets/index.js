import compose from 'koa-compose'

export default compose([
  require('./styles'),
  require('./js'),
  require('./polyfill')
])
