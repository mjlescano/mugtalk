import connect from './connect'

connect.then(socket => {
  console.log('connected!')
}).catch(err => {
  alert('Coudln\'t connect :(\n\nTry later please.')
})
