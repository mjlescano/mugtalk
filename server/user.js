import clone from 'mout/lang/deepClone'
import debug from 'debug'
import shortid from 'shortid'
import { Graph } from './ug/module'

const log = debug('mugtalk:☺')
const graph = new Graph()

// User <-- connection --> Socket <-- channel --> Talk
graph.nodes('user').createIndex('id')
graph.nodes('socket').createIndex('id')
graph.nodes('talk').createIndex('name')

export default {
  validId (id) {
    return shortid.isValid(id)
  },

  create (profile = {}) {
    const user = {
      id: shortid.isValid(profile.id) ? profile.id : shortid.generate(),
      name: ''
    }

    graph.createNode('user', user)

    return Promise.resolve(user)
  },

  find (id) {
    return new Promise((accept, reject) => {
      const user = graph.nodes('user').find(id)

      if (user) {
        accept(clone(user.properties))
      } else {
        reject(new Error('User not found.'))
      }
    })
  },

  connect (userId, socketId) {
    const user = graph.nodes('user').find(userId)
    if (!user) return Promise.reject(new Error('User not found.'))

    const socket = graph.createNode('socket', { id: socketId })

    if (graph.trace(socket, user).length()) {
      return Promise.reject(new Error('Socket already asigned to user.'))
    }

    graph.createEdge('connection').link(socket, user, true)

    return Promise.resolve()
  },

  disconnect (socketId) {
    const socket = graph.nodes('socket').destroy(socketId)
    if (!socket) return Promise.reject(new Error('Socket not found.'))
    socket.unlink()
    return Promise.resolve()
  },

  join (socketId, talkName) {
    const socket = graph.nodes('socket').find(socketId)
    if (!socket) return Promise.reject(new Error('Socket not found.'))

    let talk = graph.nodes('talk').find(talkName)
    if (!talk) talk = graph.createNode('talk', { name: talkName })

    graph.createEdge('channel').link(socket, talk, true)

    return Promise.resolve()
  },

  leave (socketId, talkName) {
    const socket = graph.nodes('socket').find(socketId)
    if (!socket) return Promise.reject(new Error('Socket not found.'))

    const talk = graph.nodes('talk').find(talkName)
    if (!talk) return Promise.reject(new Error('Talk not found.'))

    const path = graph.trace(socket, talk, 0)

    if (!path.length()) {
      return Promise.reject(new Error('Socket is not on Talk.'))
    }

    const edge = path._raw[1]

    return Promise.resolve(edge.unlink())
  },

  isOnTalk (userId, talkName) {
    const user = graph.nodes('user').find(userId)
    if (!user) return Promise.reject(new Error('User not found.'))

    const talk = graph.nodes('talk').find(talkName)
    if (!talk) return Promise.resolve(false)

    const path = graph.trace(user, talk, 0)

    return Promise.resolve(!!path.length())
  },

  ofTalk (talkName) {
    const talk = graph.nodes('talk').find(talkName)
    if (!talk) return Promise.reject(new Error('Talk not found.'))

    const paths = graph.closest(talk, {
      compare: node => node.entity === 'user',
      minDepth: 2,
      maxDepth: 2
    })

    const users = paths.map(path => clone(path.end().properties))

    return Promise.resolve(users)
  },

  talksOfSocket (socketId) {
    const socket = graph.nodes('socket').find(socketId)
    if (!socket) return Promise.reject(new Error('Socket not found.'))

    const paths = graph.closest(socket, {
      compare: node => node.entity === 'talk',
      minDepth: 1,
      maxDepth: 1
    })

    const talks = paths.map(path => clone(path.end().properties))

    return Promise.resolve(talks)
  }
}
