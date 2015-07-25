import koa from 'koa'
import socketIO from 'socket.io'
import { Server as P2PServer } from 'socket.io-p2p-server'

export const app = koa()
export const io = socketIO()
export default app

app.io = io

io.use(P2PServer)

io.on('connection', function(socket) {
  console.log('+ ', Object.keys(socket))

  socket.emit('message', 'hola!')

  socket.on('disconnect', function () {
    console.log('- ', Object.keys(socket))
  })
})

