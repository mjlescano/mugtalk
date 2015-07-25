import io from 'socket.io-client'

const socket = io()

socket.on('connect', function () {
  console.log('+ ', socket)

  socket.on('disconnect', function () {
    console.log('- ', socket)
  })

  socket.on('message', function (msg) {
    console.log('-> ', msg)
  })
})

export default socket
