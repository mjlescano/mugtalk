const app = require('koa')()
const server = require('http').createServer(app.callback())
const io = require('socket.io')(server)
const p2p = require('socket.io-p2p-server').Server

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

module.exports = app
