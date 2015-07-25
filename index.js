require('babel/register')({ extensions: ['.js'] })

var server = require('./server')
var port = 3000

server.listen(port, function(){
  console.log(' · ' + port + ' · ')
})
