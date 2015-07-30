import bus from 'bus'
import { timeout as promiseTimeout } from './lib/promise-timeout'
import connect from './connect'
import User from './user'

export function join(name){
  connect.then(socket => {
    const user = User.get()
    const room = `room:${name}`

    socket.once('room:join', (name2, user2) => {
      if (name !== name2) throw new Error('?')
      if (user.id !== user2.id) throw new Error('?')

      function onUserJoin(user){ bus.emit(`${room}:join`, user) }
      function onUserLeave(user){ bus.emit(`${room}:leave`, user) }

      socket.on(`${room}:join`, onUserJoin)
      socket.on(`${room}:leave`, onUserLeave)

      socket.once('room:leave', (name3, user3) => {
        if (name !== name3) throw new Error('?')
        if (user.id !== user3.id) throw new Error('?')

        socket.off(`${room}:join`, onUserJoin)
        socket.off(`${room}:leave`, onUserLeave)

        bus.emit('room:leave', name)
      })

      bus.emit('room:join', name)
    })

    socket.emit('room:join', name)
  }).catch(err => { throw err })
}

export function leave(name){
  connect.then(socket => {
    socket.emit('room:leave', name)
  }).catch(err => { throw err })
}

export function getUsers(name){
  return promiseTimeout(new Promise((accept, reject) => {
    connect.then(socket => {
      socket.once('room:users', (users, name2) => {
        if (name !== name2) reject(new Error('?'))
        accept(users)
      })
      socket.emit('room:users', name)
    }).catch(err => { throw err })
  }), 3000)
}
