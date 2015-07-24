import path from 'path'
import Router from 'koa-router'
import views from 'koa-render'

const app = new Router()

app.use(views(path.resolve(__dirname, '../../client'), 'jade'))

app.get('/', function *(){
  this.body = yield this.render('index')
})

export default app.middleware()
