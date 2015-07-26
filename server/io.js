import socketIO from 'socket.io'
import socketioJwt from 'socketio-jwt'
import { Server as P2PServer } from 'socket.io-p2p-server'
import { jwtSecret } from './env'

const io = socketIO()

io.use(P2PServer)

io.on('connection', socketioJwt.authorize({
  secret: jwtSecret,
  timeout: 3 * 1000
})).on('connection', function (socket){
  const id = socket.id
  console.log('+ ', id)
  socket.on('disconnect', function (socket){
    console.log('- ', id)
  })
}).on('unauthorized', function (socket){
  console.log('✗ ', socket.id, socket.decoded_token)
}).on('authenticated', function (socket){
  console.log('✓ ', socket.id, socket.decoded_token)
})

export default io
