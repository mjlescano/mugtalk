export class Talk {
  static hub = ['https://signalhub.mafintosh.com']

  swarm = null
  store = null
  connected = false

  connect ({ store, name }) {
    if (this.swarm) throw new Error(`Already connected to channel.`)

    this.store = store

    const swarm = require('webrtc-swarm')
    const signalhub = require('signalhub')

    const hub = signalhub(`mugtalk-${name}`, Talk.hub)

    this.swarm = swarm(hub)

    this.swarm.on('close', this.handleSwarmDisconnect)
    this.swarm.on('connect', this.handlePeerConnect)
    this.swarm.on('disconnect', this.handlePeerDisconnect)

    this.store.dispatch({
      type: 'CONNECT',
      talk: name,
      me: {
        id: this.swarm.me
      }
    })
  }

  disconnect () {
    this.swarm.removeListener('close', this.handleSwarmDisconnect)
    this.swarm.removeListener('connect', this.handlePeerConnect)
    this.swarm.removeListener('disconnect', this.handlePeerDisconnect)

    this.swarm.close()

    this.store.dispatch({ type: 'DISCONNECT' })

    this.swarm = null
    this.store = null
  }

  handlePeerConnect = (peer, id) => {
    peer.on('data', this.handlePeerData)

    this.store.dispatch({ type: 'PEER_CONNECT', peer: { id } })
  }

  handlePeerDisconnect = (peer, id) => {
    peer.removeListener('data', this.handlePeerData)

    this.store.dispatch({ type: 'PEER_DISCONNECT', id })
  }

  handlePeerData = (data) => {
    debugger
  }

  say = (message) => {
    const action = {
      type: 'SAY',
      message: Object.assign({
        author: this.swarm.me
      }, message)
    }

    this.store.dispatch(action)
  }

  handleSwarmDisconnect = () => {
    if (this.swarm) this.disconnect()
  }
}

export default new Talk()
