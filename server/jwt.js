import Router from 'koa-router'
import json from 'koa-json'
import jwt from 'jwt-simple'
import shortid from 'shortid'
import { jwtSecret } from './env'
import { onProduction } from './env'

const router = new Router()
const respondJson = json({ pretty: !onProduction })

router.post('/signup', respondJson, function *(){
  var userId = shortid.generate()

  this.body = {
    userId: userId,
    token: jwt.encode({ userId: userId }, jwtSecret)
  }
})

export default router.routes()
