import React from 'react'
import { connect } from 'react-redux'
import MessageFrom from './MessageForm'
import talk from '../store/talk'

export function Talk (props) {
  const {
    me,
    peers,
    messages
  } = props

  if (!props.talk) return null

  const swarm = require('webrtc-swarm')

  if (!swarm.WEBRTC_SUPPORT) {
    return <h2>Your device is not supported :(</h2>
  }

  return (
    <div>
      <p>Room: <strong>{props.talk}</strong></p>
      <p>Me: <strong>{me.id}</strong></p>
      {peers.length > 0 && <p>Peers:</p>}
      {peers.length > 0 && (
        <ul>
          {peers.map((peer) => (
            <li key={peer.id}>{peer.id}</li>
          ))}
        </ul>
      )}
      <MessageFrom onSubmit={talk.say} />
      {messages.length > 0 && (
        <div className='messages'>
          {messages.map((m) => (
            <div key={m.id}>
              <p><strong>{m.author}:</strong></p>
              <p>{m.text}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default connect((state) => ({
  talk: state.talk,
  me: state.me,
  peers: state.peers,
  messages: state.messages
}))(Talk)
