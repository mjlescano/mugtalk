import './debug'
import koa from 'koa.io'

const app = koa()

app.use(require('koa-logger')())
app.use(require('./assets'))

export default app

require('./auth')
require('./room')
