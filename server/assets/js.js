import wreq from 'koa-watchify'
import browserify from 'browserify'
import watchify from 'watchify'
import babelify from 'babelify'
import path from 'path'
import { onDevelopment } from '../env'

const src = path.resolve(__dirname, '../../client/js/index.js')
const dest = 'app.js'

let bundle = browserify({
  debug: onDevelopment,
  entries: [src],
  outfile: dest,
  detectGlobals: false,
  fullPaths: true
}).transform(babelify)

if (onDevelopment) bundle = watchify(bundle)

export default wreq(bundle)
