import debug from 'debug'
import User from '../user'

const log = debug('mugtalk:io:room')

const roomRegex = /^[a-zA-Z0-9\.]{1,63}$/
const roomRegexKey = new RegExp(roomRegex.toString().replace('^', '^room:'))

export default function room(socket, next) {
  const userId = socket.decoded_token.id
  const socketId = socket.id

  socket

  .on('room:join', function (name){
    if (!roomRegex.test(name)) return
    if (isOnRoom(socket, name)) return
    User.find(userId).then(user => {
      join(socket, name, user)
    })
  })

  .on('room:leave', function (name){
    if (!roomRegex.test(name)) {
      log('error: invalid room name', `🚪 ${name}`, `Ϟ ${socket.id}`)
      return
    }
    if (!isOnRoom(socket, name)) {
      log('error: socket is not on room', `🚪 ${name}`, `Ϟ ${socket.id}`)
      return
    }
    User.find(userId).then(user => {
      leave(socket, name, user)
    })
  })

  .on('disconnect', function (){
    User.find(userId).then(user => {
      socket.rooms.forEach(room => {
        if (!roomRegexKey.test(room)) return
        socket.in(room).emit(`${room}:leave`, user)
      })
    })
  })

  next()
}

function isOnRoom(socket, name){
  return ~socket.rooms.indexOf(`room:${name}`)
}

function join(socket, name, user){
  const room = `room:${name}`
  socket.join(room, err => {
    if (err) throw err
    log('+🚪', `🚪 ${name}`, `☺ ${user.id}`, `Ϟ ${socket.id}`)
    socket.in(room).emit(`${room}:join`, user)
  })
}

function leave(socket, name, user){
  const room = `room:${name}`
  socket.leave(room, err => {
    if (err) throw err
    log('-🚪', `🚪 ${name}`, `☺ ${user.id}`, `Ϟ ${socket.id}`)
    socket.in(room).emit(`${room}:leave`, user)
  })
}
