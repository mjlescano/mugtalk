import readFile from 'fs-readfile-promise'
import { resolve } from 'path'
import stylus from 'stylus'
import nib from 'nib'
import Router from 'koa-router'
import { onProduction, onDevelopment } from '../env'

const router = new Router()

const src = resolve(__dirname, '../../client/css/index.styl')
const dest = 'app.css'

router.get(`/${dest}`, function *(){
  this.type = 'text/css'

  let str = yield readFile(src).toString()
  let css = yield parseStylus(str, src)

  this.body = yield css
})

function parseStylus(str, filename) {
  return new Promise(function(accept, reject){
    let parsed = stylus(str).set('filename', filename).use(nib)

    if (onProduction) parsed.set('compress', true)
    if (onDevelopment) parsed.set('sourcemap', { inline: true })

    parsed.render(function(err, css) {
      if (err) reject(err)
      accept(css)
    })
  })
}

export default router.routes()
