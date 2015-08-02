import './debug'
import koa from 'koa.io'

const app = koa()

app.use(require('./assets'))

export default app

require('./home')
require('./auth')
require('./talks')
