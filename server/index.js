import koa from 'koa'
import http from 'http'
import socket from 'socket.io'
import { Server as p2p } from 'socket.io-p2p-server'

const app = koa()
const server = http.createServer(app.callback())
const io = socket(server)

io.use(p2p)

app.io = io

app.use(require('./assets'))

// app.io.on('connection', function(socket) {
//   socket.on('peer-msg', function(data) {
//     console.log('Message from peer: %s', data)
//     socket.broadcast.emit('peer-msg', data)
//   })

//   socket.on('go-private', function(data) {
//     socket.broadcast.emit('go-private', data)
//   })
// })

export default app
