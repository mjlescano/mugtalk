import koa from 'koa'
import { onProduction } from './env'

const app = koa()

app.use(require('koa-polyfill-service')({
  minify: onProduction,
  features: {
    default: { flags: ['gated'] },
    fetch: { flags: ['gated'] }
  }
}))

app.use(require('./jwt'))
app.use(require('./client'))

export default app
