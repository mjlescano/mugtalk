import debug from 'debug'
import socketIO from 'socket.io'
import { Server as P2PServer } from 'socket.io-p2p-server'
import socketioJwt from 'socketio-jwt'
import { jwtSecret } from '../env'
import User from '../user'

const log = debug('mugtalk:io')
const io = socketIO()

io.use(P2PServer)

io.use(socketioJwt.authorize({
  secret: jwtSecret,
  handshake: true
}))

io.use(function (socket, next){
  const socketId = socket.id
  const userId = socket.decoded_token.id

  User.find(userId).then(user => {
    if (user) return next()
    User.save(socket.decoded_token).then(() => next())
  })
})

io.sockets
  .on('connection', function (socket){
    const socketId = socket.id
    const userId = socket.decoded_token.id

    log('+Ϟ', `☺ ${userId}`, `Ϟ ${socketId}`)

    User.addSocket(userId, socketId)

    setTimeout(function(){
      socket.on('disconnect', function (socket){
        User.removeSocket(userId, socketId)
        log('-Ϟ', `☺ ${userId}`, `Ϟ ${socketId}`)
      })
    }, 0)
  })

io.use(require('./room'))

export default io
