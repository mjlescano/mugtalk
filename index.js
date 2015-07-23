if (!process.env.NODE_ENV) process.env.NODE_ENV = 'development'

const app = require('./server')

app.listen(3000, function(){
  console.log(' · 3000 · ')
})
