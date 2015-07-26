import debug from 'debug'

const log = debug('mugtalk:io:room')

export default function auth(socket, next) {
  socket

  .on('room:join', function (name){
    log('join', socket.id, name)
  })

  next()
}

