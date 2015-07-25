import koa from 'koa'
import client from './client'

const app = koa()

app.use(client)

export default app
