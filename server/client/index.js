import compose from 'koa-compose'

export default compose([
  require('./views'),
  require('./styles'),
  require('./js')
])
