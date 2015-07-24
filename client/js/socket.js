import io from 'socket.io-client'

const socket = io('http://mugtalk.dev')

socket.on('connect', function () {
  console.log('+ ', socket)

  socket.on('message', function (msg) {
    console.log('-> ', msg)
  })

  socket.on('disconnect', function () {
    console.log('- ', socket)
  })
})

export default socket
