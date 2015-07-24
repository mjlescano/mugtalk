import readFile from 'fs-readfile-promise'
import path from 'path'
import stylus from 'stylus'
import nib from 'nib'
import Router from 'koa-router'
import { onProduction, onDevelopment } from '../env'

const app = new Router()

const src = path.resolve(__dirname, '../../client/css/index.styl')
const dest = 'app.css'

app.get(`/${dest}`, function *(){
  this.type = 'text/css'

  let str = yield readFile(src)
  let css = yield parseStylus(str.toString(), src)

  this.body = css
})

function parseStylus(str, filename) {
  return new Promise(function(accept, reject){
    let css = stylus(str).set('filename', filename).use(nib)

    if (onProduction) css.set('compress', true)
    if (onDevelopment) css.set('sourcemap', { inline: true })

    css.render(function(err, css) {
      if (err) reject(err)
      accept(css)
    })
  })
}

export default app.middleware()
