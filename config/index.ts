import convict from 'convict'

const config = convict({
  NODE_ENV: {
    doc: 'The application environment.',
    format: ['production', 'development', 'test'],
    default: 'development',
    env: 'NODE_ENV'
  },
  API_URL: {
    doc: 'Realtime server endpoint',
    format: '*',
    default: 'ws://127.0.0.1:6020',
    env: 'API_URL'
  }
})

config.validate({ allowed: 'strict' })

export default config
