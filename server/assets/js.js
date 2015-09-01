import Router from 'koa-router'
import wreq from 'koa-watchify'
import browserify from 'browserify'
import watchify from 'watchify'
import { join } from 'path'
import { onProduction, onDevelopment } from '../env'

const router = new Router()

const src = join(__dirname, '../../client/js/index.js')
const dest = 'app.js'

let bundle = browserify({
  debug: onDevelopment,
  entries: [src],
  outfile: dest,
  fullPaths: true
}).transform('babelify')

if (onProduction) bundle.transform({ global: true }, 'uglifyify')
if (onDevelopment) bundle = watchify(bundle)

router.get(`/${dest}`, wreq(bundle))

export default router.routes()
