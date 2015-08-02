import debug from 'debug'
import { resolve } from 'path'
import Router from 'koa-router'
import views from 'koa-render'
import { onDevelopment } from './env'
import app from './'

const log = debug('mugtalk:⌂')
const router = new Router()

router.use(views(resolve(__dirname, '../client'), 'jade'))

router.get('/', function *(){
  debugger
  log('+', `⌂ ${this.ip}`)
  this.body = yield this.render('index', {
    onDevelopment: onDevelopment
  })
})

app.use(router.routes())
