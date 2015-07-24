import koa from 'koa'
import SocketIO from 'socket.io'
import { Server as HttpServer } from 'http'
import { Server as P2PServer } from 'socket.io-p2p-server'

export const app = koa()
export const server = new HttpServer(app.callback())
export const io = new SocketIO(server, { serveClient: false })

io.use(P2PServer)

io.on('connection', function(socket) {
  console.log('+ ', Object.keys(socket))

  socket.emit('message', 'hola!')

  socket.on('disconnect', function () {
    console.log('- ', Object.keys(socket))
  })
})

export default app
