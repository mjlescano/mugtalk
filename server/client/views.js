import { resolve } from 'path'
import Router from 'koa-router'
import views from 'koa-render'
import { onDevelopment } from '../env'

const router = new Router()

router.use(views(resolve(__dirname, '../../client'), 'jade'))

router.get('/', function *(){
  this.body = yield this.render('index', {
    onDevelopment: onDevelopment
  })
})

export default router.routes()
