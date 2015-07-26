import debug from 'debug'
import socketIO from 'socket.io'
import { Server as P2PServer } from 'socket.io-p2p-server'
import socketioJwt from 'socketio-jwt'
import { jwtSecret } from '../env'
import User from '../user'

const log = debug('mugtalk:io')
const io = socketIO()

io.use(P2PServer)

io.sockets
  .on('connection', socketioJwt.authorize({
    secret: jwtSecret,
    timeout: 3 * 1000
  }))
  .on('connection', function (socket){
    const socketId = socket.id
    log('+', `Ϟ ${socketId}`)
    socket.on('disconnect', function (socket){
      User.findBySocket(id).then(userId => {
        log('-', `☺ ${userId}`, `Ϟ ${socketId}`)
        User.removeSocket(userId, id)
      })
    })
  })
  .on('unauthorized', function (socket){
    const userId = socket.decoded_token.id
    log('✗', `☺ ${userId}`, `Ϟ ${socket.id}`)
  })
  .on('authenticated', function (socket){
    const userId = socket.decoded_token.id
    log('✓', `☺ ${userId}`, `Ϟ ${socket.id}`)
    User.addSocket(userId, socket.id)
  })

io.use(require('./room'))

export default io
