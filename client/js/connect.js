import io from 'socket.io-client'

const socket = io()

function connect() {
  let promise
  if (localStorage.getItem('userId')) {
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
    localStorage.setItem('userId', data.userId)
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
