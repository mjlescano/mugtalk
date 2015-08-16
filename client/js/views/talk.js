import bus from '../bus'
import React from 'react'
import Immutable from 'immutable'
import { sendMessage } from '../talks'
import Component from './component'
import UsersList from './users-list'
import MessageInput from './message-input'

export default class Talk extends Component {
  constructor (props) {
    super(props)

    this.props.talk = `talks:${this.props.name}`

    this.state = {
      users: Immutable.fromJS(this.props.users)
    }

    this._bind('handleUserJoin', 'handleUserLeave', 'sendMessage')
  }

  componentDidMount () {
    bus.on(`${this.props.talk}:join`, this.handleUserJoin, this)
    bus.on(`${this.props.talk}:leave`, this.handleUserLeave, this)
    bus.on(`${this.props.talk}:message`, this.handleUserMessage, this)
  }

  componentWillUnmount () {
    bus.off(null, null, this)
  }

  sendMessage (text) {
    sendMessage(this.props.name, text)
  }

  handleUserJoin (user) {
    this.setState({
      users: this.state.users.push(Immutable.fromJS(user))
    })
  }

  handleUserLeave (user) {
    const index = this.state.users.findIndex(u => user.id == u.id)
    this.setState({
      users: this.state.users.delete(index)
    })
  }

  handleUserMessage (userId, message) {
    console.log(userId, message)
  }

  render () {
    return (
      <div className="talk">
        <UsersList name={this.props.name} users={this.state.users} />
        <MessageInput onSubmit={this.sendMessage} />
      </div>
    )
  }
}
