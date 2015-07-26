import debug from 'debug'
import redis from 'redis-js'
import shortid from 'shortid'

const log = debug('mugtalk:user')
const client = redis.createClient()

export default {
  create () {
    return new Promise((accept, reject) => {
      accept({
        id: shortid.generate()
      })
    })
  },

  addSocket (userId, socketId) {
    client.multi()
      .set(`socket:${socketId}:user`, userId)
      .sadd(`user:${userId}:sockets`, socketId)
      .exec(err => {
        if (err) throw err
        log(`addSocket`, `☺ ${userId}`, `Ϟ ${socketId}`)
      })
  },

  removeSocket (userId, socketId) {
    client.multi()
      .del(`socket:${socketId}:user`)
      .srem(`user:${userId}:sockets`, socketId)
      .exec(err => {
        if (err) throw err
        log(`removeSocket`, `☺ ${userId}`, `Ϟ ${socketId}`)
      })
  },

  findBySocket (socketId) {
    return new Promise((accept, reject) => {
      client.get(`socket:${socketId}:user`, (err, userId) => {
        if (err) return reject(err)
        if (!userId) return reject(new Error('User not found for socket ${socketId}'))
        accept(userId)
      })
    })
  },

  getSockets (userId) {
    return client.smembers(`user:${userId}:sockets`)
  },

  isConnected (userId) {
    return !!client.scard(`user:${userId}:sockets`)
  },
}
