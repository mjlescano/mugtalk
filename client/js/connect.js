import io from 'socket.io-client'
import User from './user'

const socket = io(undefined, {
  reconnection: false
})

window.socket = socket

window.onbeforeunload = function (){
  socket.disconnect()
}

function connect() {
  let promise
  if (User.get()) {
    promise = authenticate()
  } else {
    promise = signup().then(authenticate)
  }
  return promise
}

export default connect()

function authenticate () {
  const promise = new Promise((accept, reject) => {
    socket.on('unauthorized', reject)
    socket.on('authenticated', accept)
    socket.emit('authenticate', {
      token: localStorage.getItem('token')
    })
  })

  return promise.then(() => {
    return socket
  }).catch(err => {
    throw err
  })
}

function signup () {
  return fetch('/signup', {
    method: 'post',
    headers: { 'Accept': 'application/json' }
  }).then(checkStatus).then(parseJSON).then(data => {
    User.set(data.user)
    localStorage.setItem('token', data.token)
    return socket
  }).catch(err => {
    throw err
  })
}

function checkStatus(res) {
  if (res.status >= 200 && res.status < 300) {
    return res
  } else {
    var err = new Error(res.statusText)
    err.res = res
    throw err
  }
}

function parseJSON(res) {
  return res.json()
}

socket.on('connect', function () {
  console.log('+ ', socket.id)
})

socket.on('connect_error', console.error.bind(console))

socket.on('disconnect', function () {
  console.log('- ', socket.id)
})

socket.on('error', function () {
  console.error(socket.id, arguments)
})

socket.on('unauthorized', function (err) {
  console.log('✗ ', User.get().id)
})

socket.on('authenticated', function () {
  console.log('✓ ', User.get().id)
})

socket.on('message', function (msg) {
  console.log('-> ', msg)
})
