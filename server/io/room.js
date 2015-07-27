import debug from 'debug'
import User from '../user'

const log = debug('mugtalk:io:room')

export default function room(socket, next) {
  const userId = socket.decoded_token.id
  const socketId = socket.id

  socket

  .on('room:join', function (name){
    Promise.all([join(socket, name), User.find(userId)])
      .then(([socket, user]) => {
        log('+🚪', `🚪 ${name}`, `Ϟ ${socketId}`)
        socket.in(name).emit(`room:${name}:join`, user)
      })
      .catch(err => { throw err })
  })

  next()
}

function join(socket, name){
  return new Promise((accept, reject) => {
    socket.join(name, err => {
      if (err) return reject(err)
      accept(socket)
    })
  })
}
