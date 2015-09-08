import Map from 'collections/map'
import SortedMap from 'collections/sorted-map'
import React from 'react'
import bus from '../bus'
import { sendMessage } from '../talks'
import Component from './component'
import UsersList from './users-list'
import MessagesList from './messages-list'
import MessageInput from './message-input'

export default class Talk extends Component {
  constructor (props) {
    super(props)

    if (!this.props.talk) throw new Error('Need to set talk scope.')

    const users = new Map()
    if (this.props.users) this.props.users.forEach(u => users.set(u.id, u))

    const messages = new SortedMap(null, (a, b) => {
      if (a.key) a = a.key
      if (b.key) b = b.key
      return a === b
    }, (a, b) => {
      return a.createdAt > b.createdAt ? -1 : 1
    })

    this.state = {
      users: users,
      messages: messages
    }

    this._bind(
      'handleUserJoin',
      'handleUserLeave',
      'sendMessage'
    )
  }

  componentDidMount () {
    bus.on(`${this.props.talk}:join`, this.handleUserJoin, this)
    bus.on(`${this.props.talk}:leave`, this.handleUserLeave, this)
    bus.on(`${this.props.talk}:message`, this.handleUserMessage, this)
  }

  componentWillUnmount () {
    bus.off(null, null, this)
  }

  sendMessage (message) {
    sendMessage(this.props.name, message)
  }

  handleUserJoin (user) {
    if (this.state.users.has(user.id)) return
    this.state.users.set(user.id, user)
    this.forceUpdate()
  }

  handleUserLeave (user) {
    this.state.users.delete(user.id)
    this.forceUpdate()
  }

  handleUserMessage (message) {
    this.state.messages.set(message.id, message)
    this.forceUpdate()
  }

  handleUserMessageDelete (message) {
    this.state.messages.delete(message.id)
    this.forceUpdate()
  }

  render () {
    return (
      <div className='talk'>
        <h1>Talk: {this.props.name}</h1>
        <UsersList users={this.state.users} />
        <MessagesList messages={this.state.messages} />
        <MessageInput onSubmit={this.sendMessage} />
      </div>
    )
  }
}
