const path = require('path')
const Router = require('koa-router')
const views = require('koa-render')

const app = new Router()

app.use(views(path.resolve(__dirname, '../../client'), 'jade'))

app.get('/', function *(){
  this.body = yield this.render('index')
})

module.exports = app.middleware()
