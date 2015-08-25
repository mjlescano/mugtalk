import debug from 'debug'
import Router from 'koa-router'
import json from 'koa-json'
import jwt from 'jwt-simple'
import app from './'
import User from './user'
import { jwtSecret, onProduction } from './env'

const log = debug('mugtalk:🔒')
const router = new Router()
const respondJson = json({ pretty: !onProduction })

router.post('/signup', respondJson, function *(){
  const user = yield User.create()

  this.body = {
    user: user,
    token: jwt.encode(user, jwtSecret)
  }
})

app.use(router.routes())

// Decode jwt token
app.io.use(function* (next) {
  if (!this.query.token) {
    log('Missing token.', this.query)
    return this.disconnect('Missing \'token\' param.')
  }

  try {
    this.decoded_token = jwt.decode(this.query.token, jwtSecret)
    if (!User.validId(this.decoded_token.id)) {
      throw new Error('Invalid userId')
    }
    log('+ decode', `☺ ${this.decoded_token.id}`)
  } catch (err) {
    log('✗ decode', `✗ ${err}`, this.query.token)
    return this.disconnect(err)
  }

  yield* next
})

// Validate or Save user
app.io.use(function* (next) {
  const socketId = this.id
  const userId = this.decoded_token.id

  try {
    yield User.find(userId)
  } catch (err) {
    try {
      yield User.create(this.decoded_token)
    } catch (err) {
      return this.disconnect(err)
    }
  }

  this.user = this.decoded_token
  yield* next
})

// Associate user <- socketIt
app.io.use(function* (next) {
  const socketId = this.id
  const userId = this.decoded_token.id

  try {
    yield User.connect(userId, socketId)
  } catch (err) {
    this.disconnect(err)
  }

  yield* next

  User.disconnect(socketId).catch(console.error.bind(console))
})
