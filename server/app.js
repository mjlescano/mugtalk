import koa from 'koa'

const app = koa()

app.use(require('./jwt'))
app.use(require('./client'))

export default app
