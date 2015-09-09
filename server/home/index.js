import jade from 'jade'
import debug from 'debug'
import Router from 'koa-router'
import { onProduction } from '../env'
import app from '../'

const log = debug('mugtalk:⌂')
const router = new Router()

router.use(function *(next){
  log('+', `⌂ ${this.ip}`)
  yield next
})

router.get('/', require(onProduction ? './production': './development'))

app.use(router.routes())
