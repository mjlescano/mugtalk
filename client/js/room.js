import bus from 'bus'
import { request } from './socket'
import User from './user'

export function join(name){
  const room = `room:${name}`
  const req = request('room:join', name)

  function onUserJoin(user){ bus.emit(`${room}:join`, user) }
  function onUserLeave(user){ bus.emit(`${room}:leave`, user) }

  req.then(() => {
    socket.on(`${room}:join`, onUserJoin)
    socket.on(`${room}:leave`, onUserLeave)

    socket.once('room:leave', () => {
      socket.off(`${room}:join`, onUserJoin)
      socket.off(`${room}:leave`, onUserLeave)
    })

    bus.emit('room:join', name)
  }).catch(() => {})

  return req
}

export function leave(name){
  return request('room:leave', name).then(() => {
    bus.emit('room:leave', name)
  })
}

export function getUsers(name){
  return request('room:users', name)
}
