import debug from 'debug'
import unique from 'mout/array/unique'
import clone from 'mout/lang/deepClone'
import shortid from 'shortid'
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
    User.leave(this.id, name).catch(console.error.bind(console))
    User.isOnTalk(this.user.id, name).then(isOnTalk => {
      if (!isOnTalk) app.io.in(talk).emit(`${talk}:leave`, this.user)
    }).catch(console.error.bind(console))
  })
})

app.io.route('talks:join', function* (next, name){
  if (invalidTalkName('+ Ϟ', this, name)) return
  if (isOnTalk('+ Ϟ', this, name)) return

  const talk = `talks:${name}`
  const wasOnTalk = yield User.isOnTalk(this.user.id, name)

  this.join(talk, err => {
    if (err) return log('✗ + Ϟ', `✗ ${err}`, `☁ ${name}`, `Ϟ ${this.id}`)
    log('+ Ϟ', `☁ ${name}`, `☺ ${this.user.id}`, `Ϟ ${this.id}`)
    this.talks.push(name)
    User.join(this.id, name).catch(console.error.bind(console))
    this.emit('talks:join', name)
    if (!wasOnTalk) app.io.in(talk).emit(`${talk}:join`, this.user)
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
    User.leave(this.id, name).catch(console.error.bind(console))
    this.emit('talks:leave', talk)

    User.isOnTalk(this.user.id, name).then(isOnTalk => {
      if (!isOnTalk) app.io.in(talk).emit(`${talk}:leave`, this.user)
    }).catch(console.error.bind(console))
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

app.io.route('talks:message', function* (next, name, data){
  if (invalidTalkName('+ ☄', this, name)) return
  if (isNotOnTalk('+ ☄', this, name)) return

  if ('object' !== typeof data) {
    log(`✗ + ☄`, '✗ data is not an object', `data ${data}`, `☁ ${name}`, `Ϟ ${socket.id}`)
    return
  }

  if ('string' !== typeof data.text) {
    log(`✗ + ☄`, '✗ data.text is not a string', `data.text ${data.text}`, `☁ ${name}`, `Ϟ ${socket.id}`)
    return
  }

  if (!data.id || 'string' !== typeof data.id || data.id.length > 31) {
    log(`✗ + ☄`, '✗ data.id is not valid', `data.id ${data.id}`, `☁ ${name}`, `Ϟ ${socket.id}`)
    return
  }

  let text = data.text.trim()

  if (!text) {
    log(`✗ + ☄`, '✗ data.text is only whitesace', `☁ ${name}`, `Ϟ ${socket.id}`)
    return
  }

  const talk = `talks:${name}`

  const message = {
    id: data.id,
    text: data.text,
    userId: this.user.id,
    createdAt: Date.now()
  }

  this.emit('talks:message')
  app.io.in(talk).emit(`${talk}:message`, message)

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
