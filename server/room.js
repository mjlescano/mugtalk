import debug from 'debug'
import unique from 'mout/array/unique'
import { User } from './models'
import app from './'

const log = debug('mugtalk:🚪')

const roomRegex = /^[a-zA-Z0-9\.]{1,63}$/
const roomRegexKey = new RegExp(roomRegex.toString().replace('^', '^room:'))

app.io.use(function* (next) {
  yield* next
  this.rooms.forEach(room => {
    if (!roomRegexKey.test(room)) return
    this.in(room).emit(`${room}:leave`, this.user)
  })
})


app.io.route('room:join', function* (next, name){
  if (!roomRegex.test(name)) {
    log('✗ + Ϟ', '✗ invalid room name', `🚪 ${name}`, `Ϟ ${this.id}`)
    return
  }

  if (isOnRoom(this, name)) {
    log('✗ + Ϟ', '✗ socket is already on room', `🚪 ${name}`, `Ϟ ${this.id}`)
    return
  }

  const room = `room:${name}`

  this.join(room, err => {
    if (err) return log('✗ + Ϟ', `✗ ${err}`, `🚪 ${name}`, `Ϟ ${this.id}`)
    log('+ Ϟ', `🚪 ${name}`, `☺ ${this.user.id}`, `Ϟ ${this.id}`)
    this.emit('room:join', name, this.user)
    this.broadcast.in(room).emit(`${room}:join`, this.user)
  })
})

app.io.route('room:leave', function* (next, name){
  if (!roomRegex.test(name)) {
    log('✗ - Ϟ', '✗ invalid room name', `🚪 ${name}`, `Ϟ ${this.id}`)
    return
  }

  if (!isOnRoom(this, name)) {
    log('✗ - Ϟ', '✗ socket is not on room', `🚪 ${name}`, `Ϟ ${this.id}`)
    return
  }

  const room = `room:${name}`

  this.leave(room, err => {
    if (err) return log('✗ - Ϟ', `✗ ${err}`, `🚪 ${name}`, `Ϟ ${this.id}`)
    log('- Ϟ', `🚪 ${name}`, `☺ ${this.user.id}`, `Ϟ ${this.id}`)
    this.emit('room:leave', room, this.user)
    this.in(room).emit(`${room}:leave`, this.user)
  })
})

app.io.route('room:users', function* (next, name){
  if (!roomRegex.test(name)) {
    log('✗ 🔍 ☺', '✗ invalid room name', `🚪 ${name}`, `Ϟ ${this.id}`)
    return
  }

  if (!isOnRoom(this, name)) {
    log('✗ 🔍 ☺', '✗ socket is not on room', `🚪 ${name}`, `Ϟ ${this.id}`)
    return
  }

  const room = `room:${name}`
  const socketsIds = Object.keys(this.socket.nsp.adapter.rooms[room])

  try {
    let users = yield Promise.all(socketsIds.map(socketId => {
      return User.findBySocket(socketId)
    }))

    users = unique(users, (a, b) => a.id === b.id)
    log('🔍', `🔍 users`, `🚪 ${name}`, `Ϟ ${this.id}`)
    this.emit(`room:users`, users, name)
  } catch (err) {
    log('✗ 🔍', `✗ ${err}`, `🔍 users`, `🚪 ${name}`, `Ϟ ${this.id}`)
  }
})

function isOnRoom(socket, name){
  return ~socket.rooms.indexOf(`room:${name}`)
}
