import bus from './bus'
import { connect, request } from './socket'
import User from './user'

export function join(name){
  const talk = `talks:${name}`
  const promise = Promise.all([connect(), request('talks:join', name)])

  function onUserJoin(user){ bus.trigger(`${talk}:join`, user) }
  function onUserLeave(user){ bus.trigger(`${talk}:leave`, user) }
  function onUserMessage(userId, message){ bus.trigger(`${talk}:message`, userId, message) }

  return promise.then(([socket]) => {
    function onLeave(_name) {
      if (name !== _name) return
      bus.off('talks:leave', onLeave)
      socket.off(`${talk}:join`, onUserJoin)
      socket.off(`${talk}:leave`, onUserLeave)
      socket.off(`${talk}:message`, onUserMessage)
    }

    socket.on(`${talk}:join`, onUserJoin)
    socket.on(`${talk}:leave`, onUserLeave)
    socket.on(`${talk}:message`, onUserMessage)

    bus.on('talks:leave', onLeave)
    bus.trigger('talks:join', name)

    return name
  })
}

export function leave(name){
  return request('talks:leave', name).then(() => {
    bus.trigger('talks:leave', name)
    return name
  })
}

export function getUsers(name){
  return request('talks:users', name)
}

export function sendMessage(name, message){
  return request('talks:message', name, message)
}
