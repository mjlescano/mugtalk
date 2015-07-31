import { readFile } from 'mz/fs'
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

  let str = yield readFile(src)
  let css = yield parseStylus(str.toString(), src)

  this.body = css
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
