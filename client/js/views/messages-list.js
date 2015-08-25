import React from 'react'
import Component from './component'

class Message extends Component {
  render () {
    return (
      <p data-created-at={this.props.createdAt}>{this.props.userId}:&nbsp;{this.props.text}</p>
    )
  }
}

export default class MessagesList extends Component {
  render () {
    return (
      <div className="messages-list">
        {Array.from(this.props.messages.values()).map(message => {
          return (
            <Message
              key={message.id}
              text={message.text}
              userId={message.userId}
            />
          )
        })}
      </div>
    )
  }
}
