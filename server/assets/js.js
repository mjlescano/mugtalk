import Router from 'koa-router'
import wreq from 'koa-watchify'
import browserify from 'browserify'
import watchify from 'watchify'
import path from 'path'
import { onProduction, onDevelopment } from '../env'

const app = new Router()

const src = path.resolve(__dirname, '../../client/js/index.js')
const dest = 'app.js'

let bundle = browserify({
  debug: onDevelopment,
  entries: [src],
  outfile: dest,
  fullPaths: true
}).transform('babelify')

if (onProduction) bundle.transform('uglifyify')
if (onDevelopment) bundle = watchify(bundle)

app.get(`/${dest}`, wreq(bundle))

export default app.middleware()
