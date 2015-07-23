const readFile = require('fs-readfile-promise')
const path = require('path')
const stylus = require('stylus')
const nib = require('nib')
const Router = require('koa-router')

const app = new Router()

const src = path.resolve(__dirname, '../../client/css/index.styl')
const dest = 'app.css'

app.get(`/${dest}`, function *(){
  this.type = 'text/css'

  var str = yield readFile(src)
  var css = yield parse(str.toString(), src)

  this.body = css
})

function parse(str, filename) {
  return new Promise(function(accept, reject){
    stylus(str)
      .set('filename', filename)
      .use(nib)
      .render(function(err, css) {
        if (err) reject(err)
        accept(css)
      })
  })
}

module.exports = app.middleware()
