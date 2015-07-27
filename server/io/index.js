import debug from 'debug'
import socketIO from 'socket.io'
import { Server as P2PServer } from 'socket.io-p2p-server'
import socketioJwt from 'socketio-jwt'
import { jwtSecret } from '../env'
import { User } from '../models'

const log = debug('mugtalk')
const io = socketIO()

io.use(P2PServer)

io.use(socketioJwt.authorize({
  secret: jwtSecret,
  handshake: true
}))

io.use(function (socket, next){
  const socketId = socket.id
  const userId = socket.decoded_token.id

  log('+ Ϟ', `Ϟ ${socketId}`)

  User.find(userId).then(user => {
    if (user) return next()
    User.save(socket.decoded_token)
      .then(() => next())
      .catch(err => { log('✗ + Ϟ', `✗ ${err}`, `Ϟ ${socketId}`) })
  }).catch(err => {
    log('✗ + Ϟ', `✗ ${err}`, `Ϟ ${socketId}`)
  })
})

io.sockets
  .on('connection', function (socket){
    const socketId = socket.id
    const userId = socket.decoded_token.id

    User.addSocket(userId, socketId)

    setTimeout(function(){
      socket.on('disconnect', function (socket){
        User.removeSocket(userId, socketId)
        log('- Ϟ', `Ϟ ${socketId}`)
      })
    }, 0)
  })

io.use(require('./room'))

export default io
