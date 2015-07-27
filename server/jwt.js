import Router from 'koa-router'
import json from 'koa-json'
import jwt from 'jwt-simple'
import { User } from './models'
import { jwtSecret, onProduction } from './env'

const router = new Router()
const respondJson = json({ pretty: !onProduction })

router.post('/signup', respondJson, function *(){
  const user = yield User.create()

  this.body = {
    user: user,
    token: jwt.encode(user, jwtSecret)
  }
})

export default router.routes()
