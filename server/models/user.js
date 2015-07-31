import debug from 'debug'
import redis from 'redis-js'
import shortid from 'shortid'

const log = debug('mugtalk:☺')
const client = redis.createClient()

function toHash(a){
  let l = a.length
  if (l % 2) throw new Error('Key-value pairs are not congruent.')
  const hash = {}
  for (let i = 0; i < l; i += 2) hash[a[i]] = a[i + 1]
  return hash
}

export default {
  save (user) {
    return new Promise((accept, reject) => {
      client.hmset(`user:${user.id}`, 'id', user.id, err => {
        if (err) return reject(err)
        log(`+`, `☺ ${user.id}`)
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
        if (Array.isArray(user)) {
          if (!user.length) return reject(new Error(`User ${userId} not found`))
          user = toHash(user)
        }
        accept(user)
      })
    })
  },

  addSocket (userId, socketId) {
    return new Promise((accept, reject) => {
      client.multi()
        .set(`socket:${socketId}:user`, userId)
        .sadd(`user:${userId}:sockets`, socketId)
        .exec(err => {
          if (err) {
            log(`✗ ← Ϟ`, `☺ ${userId}`, `Ϟ ${socketId}`)
            reject(err)
          }
          log(`← Ϟ`, `☺ ${userId}`, `Ϟ ${socketId}`)
          accept()
        })
    })
  },

  removeSocket (userId, socketId) {
    return new Promise((accept, reject) => {
      client.multi()
        .del(`socket:${socketId}:user`)
        .srem(`user:${userId}:sockets`, socketId)
        .exec(err => {
          if (err) {
            log(`✗ ↚ Ϟ`, `☺ ${userId}`, `Ϟ ${socketId}`)
            reject(err)
          }
          log(`↚ Ϟ`, `☺ ${userId}`, `Ϟ ${socketId}`)
          accept()
        })
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
  }
}
