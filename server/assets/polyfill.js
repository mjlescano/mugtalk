import polyfillService from 'koa-polyfill-service'
import { onProduction } from '../env'

export default polyfillService({
  minify: onProduction,
  features: {
    default: { flags: ['gated'] },
    fetch: { flags: ['gated'] }
  }
})
