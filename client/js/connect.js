import io from 'socket.io-client'
import User from './user'

function connect(){
  if (User.get()){
    return singin()
  } else {
    return signup().then(singin)
  }
}

export default connect()

function singin (){
  return new Promise((accept, reject) => {
    const socket = io(undefined, {
      reconnection: false,
      query: `token=${localStorage.getItem('token')}`
    })

    debug(socket)

    window.onbeforeunload = function (){
      socket.disconnect()
    }

    socket.on('connect', onConnect)
    socket.on('connect_error', onError)

    function onConnect(){
      socket.off('connect', onConnect)
      socket.off('connect_error', onError)
      accept(socket)
    }

    function onError(err){
      socket.off('connect', onConnect)
      socket.off('connect_error', onError)
      reject(err)
    }
  })
}

function signup (){
  return fetch('/signup', {
    method: 'post',
    headers: { 'Accept': 'application/json' }
  }).then(checkStatus).then(parseJSON).then(data => {
    User.set(data.user)
    localStorage.setItem('token', data.token)
    return data
  }).catch(err => {
    throw err
  })
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

function debug(socket) {
  window.socket = socket

  socket.on('connect', function (){
    console.log('+ ', socket.id)
  })

  socket.on('connect_error', console.error.bind(console))

  socket.on('disconnect', function (){
    console.log('- ', socket.id)
  })

  socket.on('error', function (){
    console.error(socket.id, arguments)
  })

  socket.on('unauthorized', function (err){
    console.log('✗ ', User.get().id)
  })

  socket.on('authenticated', function (){
    console.log('✓ ', User.get().id)
  })

  socket.on('message', function (msg){
    console.log('-> ', msg)
  })
}

