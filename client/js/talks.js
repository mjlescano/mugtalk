import bus from 'bus'
import { request } from './socket'
import User from './user'

export function join(name){
  const talk = `talks:${name}`
  const req = request('talks:join', name)

  function onUserJoin(user){ bus.emit(`${talk}:join`, user) }
  function onUserLeave(user){ bus.emit(`${talk}:leave`, user) }

  req.then(() => {
    socket.on(`${talk}:join`, onUserJoin)
    socket.on(`${talk}:leave`, onUserLeave)

    socket.once('talks:leave', () => {
      socket.off(`${talk}:join`, onUserJoin)
      socket.off(`${talk}:leave`, onUserLeave)
    })

    bus.emit('talks:join', name)
  }).catch(() => {})

  return req
}

export function leave(name){
  return request('talks:leave', name).then(() => {
    bus.emit('talks:leave', name)
  })
}

export function getUsers(name){
  return request('talks:users', name)
}
