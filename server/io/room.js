import debug from 'debug'
import unique from 'mout/array/unique'
import { User } from '../models'

const log = debug('mugtalk:🚪')

const roomRegex = /^[a-zA-Z0-9\.]{1,63}$/
const roomRegexKey = new RegExp(roomRegex.toString().replace('^', '^room:'))

export default function room(socket, next) {
  const userId = socket.decoded_token.id
  const socketId = socket.id

  socket

  .on('room:join', function (name){
    if (!roomRegex.test(name)) {
      log('✗ + Ϟ', '✗ invalid room name', `🚪 ${name}`, `Ϟ ${socket.id}`)
      return
    }

    if (isOnRoom(socket, name)) {
      log('✗ + Ϟ', '✗ socket is already on room', `🚪 ${name}`, `Ϟ ${socket.id}`)
      return
    }

    const room = `room:${name}`

    User.find(userId).then(user => {
      socket.join(room, err => {
        if (err) throw err
        log('+ Ϟ', `🚪 ${name}`, `☺ ${user.id}`, `Ϟ ${socket.id}`)
        socket.emit('room:join', name, user)
        socket.in(room).emit(`${room}:join`, user)
      })
    }).catch(err => {
      log('✗ + Ϟ', `✗ ${err}`, `🚪 ${name}`, `Ϟ ${socket.id}`)
    })
  })

  .on('room:leave', function (name){
    if (!roomRegex.test(name)) {
      log('✗ - Ϟ', '✗ invalid room name', `🚪 ${name}`, `Ϟ ${socket.id}`)
      return
    }

    if (!isOnRoom(socket, name)) {
      log('✗ - Ϟ', '✗ socket is not on room', `🚪 ${name}`, `Ϟ ${socket.id}`)
      return
    }

    const room = `room:${name}`

    User.find(userId).then(user => {
      socket.leave(room, err => {
        if (err) throw err
        log('- Ϟ', `🚪 ${name}`, `☺ ${user.id}`, `Ϟ ${socket.id}`)
        socket.emit('room:leave', room, user)
        socket.in(room).emit(`${room}:leave`, user)
      })
    }).catch(err => {
      log('✗ - Ϟ', `✗ ${err}`, `🚪 ${name}`, `Ϟ ${socket.id}`)
    })
  })

  .on('room:users', function (name){
    if (!roomRegex.test(name)) {
      log('✗ 🔍 ☺', '✗ invalid room name', `🚪 ${name}`, `Ϟ ${socket.id}`)
      return
    }

    if (!isOnRoom(socket, name)) {
      log('✗ 🔍 ☺', '✗ socket is not on room', `🚪 ${name}`, `Ϟ ${socket.id}`)
      return
    }

    const room = `room:${name}`
    const socketsIds = Object.keys(socket.nsp.adapter.rooms[room])

    Promise.all(socketsIds.map(socketId => User.findBySocket(socketId)))
      .then(users => {
        users = unique(users, (a, b) => a.id === b.id)
        socket.emit(`${room}:users`, users)
        log('🔍', `🔍 users`, `🚪 ${name}`, `Ϟ ${socket.id}`)
      })
      .catch(err => {
        log('✗ 🔍', `✗ ${err}`, `🔍 users`, `🚪 ${name}`, `Ϟ ${socket.id}`)
      })
  })

  .on('disconnect', function (){
    User.find(userId).then(user => {
      socket.rooms.forEach(room => {
        if (!roomRegexKey.test(room)) return
        socket.in(room).emit(`${room}:leave`, user)
      })
    }).catch(err => {
      log('✗', `✗ ${err}`)
    })
  })

  next()
}

function isOnRoom(socket, name){
  return ~socket.rooms.indexOf(`room:${name}`)
}
