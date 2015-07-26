import socketIO from 'socket.io'
import socketioJwt from 'socketio-jwt'
import { Server as P2PServer } from 'socket.io-p2p-server'
import { jwtSecret } from './env'

const io = socketIO()

io.use(P2PServer)

io.on('connect', function (socket){
  console.log('+ ', socket.id)

  socket.on('disconnect', function (){
    console.log('- ', socket.id)
  })

  socket.on('unauthorized', function (){
    console.log('✗ ', socket.id, arguments)
  })

  socket.on('authenticated', function (){
    console.log('✓ ', socket.id, arguments)
  })
}).on('connection', socketioJwt.authorize({
  secret: jwtSecret,
  timeout: 1000 * 15
}))

export default io
