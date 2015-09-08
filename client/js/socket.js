import io from 'socket.io-client'
import timeout from './lib/timeout'
import User from './user'

export function request(url, ...data){
  return timeout(new Promise((accept, reject) => {
    connect().then(socket => {
      socket.once(url, accept)
      socket.emit(url, ...data)
    }).catch(reject)
  }), 3000).catch(err => {
    throw err
  })
}

export function connect(){
  return signup().then(singin)
}

let _socket, _signingPromise
function singin(){
  if (_socket) return Promise.resolve(_socket)
  if (_signingPromise) return _signingPromise

  _signingPromise = new Promise((accept, reject) => {
    const socket = io(undefined, {
      reconnection: false,
      query: `token=${localStorage.getItem('token')}`
    })

    socket.on('connect', onConnect)
    socket.on('disconnect', onDisconnect)

    function onConnect(){
      socket.off('connect', onConnect)
      socket.off('disconnect', onDisconnect)
      window.onbeforeunload = () => { socket.disconnect() }
      _socket = socket
      _signingPromise = null
      accept(socket)
    }

    function onDisconnect(err){
      socket.off('connect', onConnect)
      socket.off('disconnect', onDisconnect)
      _socket = null
      _signingPromise = null
      reject(err)
    }
  })

  return _signingPromise
}

function signup(profile){
  if (User.get()) return Promise.resolve(User.get())

  return fetch('/signup', {
    method: 'post',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ profile: profile })
  }).then(checkStatus).then(parseJSON).then(data => {
    User.set(data.user)
    localStorage.setItem('token', data.token)
    return data
  }).catch(err => { throw err })
}

function checkStatus(res){
  if (res.status >= 200 && res.status < 300){
    return res
  } else {
    var err = new Error(res.statusText)
    err.res = res
    throw err
  }
}

function parseJSON(res){
  return res.json()
}
