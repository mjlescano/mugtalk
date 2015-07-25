import Router from 'koa-router'
import wreq from 'koa-watchify'
import browserify from 'browserify'
import watchify from 'watchify'
import { resolve } from 'path'
import { onProduction, onDevelopment } from '../env'

const router = new Router()

const src = resolve(__dirname, '../../client/js/index.js')
const dest = 'app.js'

let bundle = browserify({
  debug: onDevelopment,
  entries: [src],
  outfile: dest,
  fullPaths: true
}).transform('babelify')

if (onProduction) bundle.transform('uglifyify')
if (onDevelopment) bundle = watchify(bundle)

router.get(`/${dest}`, wreq(bundle))

export default router.routes()
