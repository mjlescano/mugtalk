import { resolve } from 'path'
import Router from 'koa-router'
import views from 'koa-render'

const router = new Router()

router.use(views(resolve(__dirname, '../../client'), 'jade'))

router.get('/', function *(){
  this.body = yield this.render('index')
})

export default router.routes()
