import compose from 'koa-compose'
import { onDevelopment } from '../env'

const libs = [
  require('./styles'),
  require('./js')
]

if (onDevelopment) libs.push(require('./polyfill'))

export default compose(libs)
