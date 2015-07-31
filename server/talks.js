import debug from 'debug'
import unique from 'mout/array/unique'
import { User } from './models'
import app from './'

const log = debug('mugtalk:☁')

const talkRegex = /^[a-zA-Z0-9\.]{1,63}$/

app.io.use(function* (next) {
  this.talks = []

  yield* next

  this.talks.forEach(name => {
    const talk = `talks:${name}`
    log('- Ϟ', `☁ ${name}`, `☺ ${this.user.id}`, `Ϟ ${this.id}`)
    this.in(talk).emit(`${talk}:leave`, this.user)
  })
})


app.io.route('talks:join', function* (next, name){
  if (!talkRegex.test(name)) {
    log('✗ + Ϟ', '✗ invalid talk name', `☁ ${name}`, `Ϟ ${this.id}`)
    return
  }

  if (isOnTalk(this, name)) {
    log('✗ + Ϟ', '✗ socket is already on talk', `☁ ${name}`, `Ϟ ${this.id}`)
    return
  }

  const talk = `talks:${name}`

  this.join(talk, err => {
    if (err) return log('✗ + Ϟ', `✗ ${err}`, `☁ ${name}`, `Ϟ ${this.id}`)
    log('+ Ϟ', `☁ ${name}`, `☺ ${this.user.id}`, `Ϟ ${this.id}`)
    this.talks.push(name)
    this.emit('talks:join', name, this.user)
    this.broadcast.in(talk).emit(`${talk}:join`, this.user)
  })
})

app.io.route('talks:leave', function* (next, name){
  if (!talkRegex.test(name)) {
    log('✗ - Ϟ', '✗ invalid talk name', `☁ ${name}`, `Ϟ ${this.id}`)
    return
  }

  if (!isOnTalk(this, name)) {
    log('✗ - Ϟ', '✗ socket is not on talk', `☁ ${name}`, `Ϟ ${this.id}`)
    return
  }

  const talk = `talks:${name}`

  this.leave(talk, err => {
    if (err) return log('✗ - Ϟ', `✗ ${err}`, `☁ ${name}`, `Ϟ ${this.id}`)
    log('- Ϟ', `☁ ${name}`, `☺ ${this.user.id}`, `Ϟ ${this.id}`)
    this.talks.splice(this.talks.indexOf(name), 1)
    this.emit('talks:leave', talk, this.user)
    this.in(talk).emit(`${talk}:leave`, this.user)
  })
})

app.io.route('talks:users', function* (next, name){
  if (!talkRegex.test(name)) {
    log('✗ 🔍 ☺', '✗ invalid talk name', `☁ ${name}`, `Ϟ ${this.id}`)
    return
  }

  if (!isOnTalk(this, name)) {
    log('✗ 🔍 ☺', '✗ socket is not on talk', `☁ ${name}`, `Ϟ ${this.id}`)
    return
  }

  const talk = `talks:${name}`
  const socketsIds = Object.keys(this.socket.nsp.adapter.rooms[talk])

  try {
    let users = yield Promise.all(socketsIds.map(socketId => {
      return User.findBySocket(socketId)
    }))

    users = unique(users, (a, b) => a.id === b.id)
    log('🔍', `🔍 users`, `☁ ${name}`, `Ϟ ${this.id}`)
    this.emit(`talks:users`, users, name)
  } catch (err) {
    log('✗ 🔍', `✗ ${err}`, `🔍 users`, `☁ ${name}`, `Ϟ ${this.id}`)
  }
})

function isOnTalk(socket, name){
  return !!~socket.talks.indexOf(name)
}
