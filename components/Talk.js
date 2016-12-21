import React from 'react'
import { connect } from 'react-redux'

export const Talk = ({ talk, peers, me }) => {
  if (!talk) return null

  return (
    <div>
      <p>Room: <strong>{ talk }</strong></p>
      <p>Me: <strong>{ me.id }</strong></p>
      <p>Peers:</p>
      {peers.length > 0 && (
        <ul>
          {peers.map((peer) => (
            <li key={peer.id}>{peer.id}</li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default connect((state) => ({
  talk: state.talk,
  peers: state.peers,
  me: state.me
}))(Talk)
