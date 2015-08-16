import debug from 'debug'
import unique from 'mout/array/unique'
import clone from 'mout/lang/deepClone'
import User from './user'
import app from './'

const log = debug('mugtalk:☁')

const talkRegex = /^[a-zA-Z0-9\.]{1,63}$/

app.io.use(function* (next) {
  this.talks = []

  yield* next

  this.talks.forEach(name => {
    const talk = `talks:${name}`
    log('- Ϟ', `☁ ${name}`, `☺ ${this.user.id}`, `Ϟ ${this.id}`)
    this.broadcast.in(talk).emit(`${talk}:leave`, this.user)
  })
})

app.io.route('talks:join', function* (next, name){
  if (invalidTalkName('+ Ϟ', this, name)) return
  if (isOnTalk('+ Ϟ', this, name)) return

  const talk = `talks:${name}`

  this.join(talk, err => {
    if (err) return log('✗ + Ϟ', `✗ ${err}`, `☁ ${name}`, `Ϟ ${this.id}`)
    log('+ Ϟ', `☁ ${name}`, `☺ ${this.user.id}`, `Ϟ ${this.id}`)
    this.talks.push(name)
    User.join(this.id, name)
    this.emit('talks:join', name)
    this.broadcast.in(talk).emit(`${talk}:join`, this.user)
  })
})

app.io.route('talks:leave', function* (next, name){
  if (invalidTalkName('- Ϟ', this, name)) return
  if (isNotOnTalk('- Ϟ', this, name)) return

  const talk = `talks:${name}`

  this.leave(talk, err => {
    if (err) return log('✗ - Ϟ', `✗ ${err}`, `☁ ${name}`, `Ϟ ${this.id}`)
    log('- Ϟ', `☁ ${name}`, `☺ ${this.user.id}`, `Ϟ ${this.id}`)
    this.talks.splice(this.talks.indexOf(name), 1)
    User.leave(this.id, name)
    this.emit('talks:leave', talk)
    this.broadcast.in(talk).emit(`${talk}:leave`, this.user)
  })
})

app.io.route('talks:users', function* (next, name){
  if (invalidTalkName('🔍 ☺', this, name)) return
  if (isNotOnTalk('🔍 ☺', this, name)) return

  const talk = `talks:${name}`
  const socket = this

  try {
    let users = yield User.ofTalk(name)
    users = JSON.parse(JSON.stringify(users)) // wut?
    this.emit('talks:users', users)
    log('🔍 ☺', '🔍 users', `☁ ${name}`, `Ϟ ${this.id}`)
  } catch (err) {
    log('✗ 🔍 ☺', `✗ ${err}`, '🔍 users', `☁ ${name}`, `Ϟ ${this.id}`)
  }
})

app.io.route('talks:message', function* (next, name, message){
  if (invalidTalkName('+ ☄', this, name)) return
  if (isNotOnTalk('+ ☄', this, name)) return
  if ('string' !== typeof message) return

  message = message.trim()

  if (!message) return

  const talk = `talks:${name}`

  this.emit(`talks:message`)
  this.broadcast.in(talk).emit(`${talk}:message`, this.user.id, message)

  log('+ ☄', `☁ ${name}`, `Ϟ ${this.id}`)
})

function invalidTalkName(scope, socket, name){
  if (talkRegex.test(name)) return false
  log(`✗ ${scope}`, '✗ invalid talk name', `☁ ${name}`, `Ϟ ${socket.id}`)
  return true
}

function isNotOnTalk(scope, socket, name){
  if (~socket.talks.indexOf(name)) return false
  log(`✗ ${scope}`, '✗ socket is not on talk', `☁ ${name}`, `Ϟ ${socket.id}`)
  return true
}

function isOnTalk(scope, socket, name){
  if (!~socket.talks.indexOf(name)) return false
  log(`✗ ${scope}`, '✗ socket is already on talk', `☁ ${name}`, `Ϟ ${socket.id}`)
  return true
}
