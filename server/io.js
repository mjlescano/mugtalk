import socketIO from 'socket.io'
import { Server as P2PServer } from 'socket.io-p2p-server'

const io = socketIO()

io.use(P2PServer)

io.on('connection', function(socket) {
  console.log('+ ', socket.id)

  socket.on('disconnect', function () {
    console.log('- ', socket.id)
  })
})

export default io
