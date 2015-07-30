require('babel/register')({ extensions: ['.js'] })
require('./server/debug')

var log = require('debug')('mugtalk')
var server = require('./server')
var port = 3000

server.listen(port, function(){
  log(' · ' + port + ' · ')
})
