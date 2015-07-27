import debug from 'debug'
import redis from 'redis-js'
import shortid from 'shortid'

const log = debug('mugtalk:user')
const client = redis.createClient()

export default {
  save (user) {
    return new Promise((accept, reject) => {
      client.hmset(`user:${user.id}`, 'id', user.id, err => {
        if (err) reject(err)
        log(`+☺`, `☺ ${user.id}`)
        accept(user)
      })
    })
  },

  create () {
    const user = {
      id: shortid.generate()
    }
    return this.save(user)
  },

  find (userId) {
    return new Promise((accept, reject) => {
      client.hgetall(`user:${userId}`, (err, user) => {
        if (err) return reject(err)
        if (Array.isArray(user) && !user.length) accept(null)
        accept(user)
      })
    })
  },

  addSocket (userId, socketId) {
    client.multi()
      .set(`socket:${socketId}:user`, userId)
      .sadd(`user:${userId}:sockets`, socketId)
      .exec(err => {
        if (err) throw err
        log(`+Ϟ`, `☺ ${userId}`, `Ϟ ${socketId}`)
      })
  },

  removeSocket (userId, socketId) {
    client.multi()
      .del(`socket:${socketId}:user`)
      .srem(`user:${userId}:sockets`, socketId)
      .exec(err => {
        if (err) throw err
        log(`-Ϟ`, `☺ ${userId}`, `Ϟ ${socketId}`)
      })
  },

  findBySocket (socketId) {
    return new Promise((accept, reject) => {
      client.get(`socket:${socketId}:user`, (err, userId) => {
        if (err) return reject(err)
        if (!userId) return reject(new Error('User not found for socket ${socketId}'))
        accept({
          id: userId
        })
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
