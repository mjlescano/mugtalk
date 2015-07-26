import connect from './connect'

connect.then(socket => {
  console.log('connected!')
}).catch(err => {
  alert('Coudlnt connect :(')
})
