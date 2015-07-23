const readFile = require('fs-readfile-promise')
const path = require('path')
const stylus = require('stylus')
const Router = require('koa-router')

const app = new Router()
const file = path.resolve(__dirname, '../../client/app.styl')

app.get('/app.css', function *(){
  this.type = 'text/css'

  var str = yield readFile(file)
  var css = yield parse(str.toString(), 'app.css')

  this.body = css
})

function parse(str, filename) {
  return new Promise(function(accept, reject){
    stylus(str).set('filename', filename).render(function(err, css) {
      if (err) reject(err)
      accept(css)
    })
  })
}

module.exports = app.middleware()
