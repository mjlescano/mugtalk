const config = require('./config')

module.exports = {
  env: {
    API_URL: config.get('API_URL')
  }
}
