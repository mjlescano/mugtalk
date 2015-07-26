import io from 'socket.io-client'

const socket = io()

socket.on('connect', function () {
  console.log('+ ', socket.id)
})

socket.on('disconnect', function () {
  console.log('- ', socket.id)
})

socket.on('error', function () {
  console.error(socket.id, arguments)
})

socket.on('unauthorized', function (err) {
  console.log('✗ ', localStorage.getItem('userId'))
})

socket.on('authenticated', function () {
  console.log('✓ ', localStorage.getItem('userId'))
})

socket.on('message', function (msg) {
  console.log('-> ', msg)
})

if (localStorage.getItem('userId')) {
  authenticate()
} else {
  signup().then(authenticate)
}

export default socket

function authenticate () {
  socket.emit('authenticate', {
    token: localStorage.getItem('token')
  })
}

function signup () {
  return fetch('/signup', {
    method: 'post',
    headers: { 'Accept': 'application/json' }
  }).then(checkStatus).then(parseJSON).then(data => {
    localStorage.setItem('userId', data.userId)
    localStorage.setItem('token', data.token)
    return data
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
