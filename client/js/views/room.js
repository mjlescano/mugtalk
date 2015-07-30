import bus from 'bus'
import React, { Component } from 'react'
import Immutable from 'immutable'

class User extends Component {
  render () {
    return <p>User: {this.props.data.id}</p>
  }
}

export default class Room extends Component {
  constructor (props) {
    super(props);
    this.state = {
      users: Immutable.fromJS(props.users)
    }
  }

  componentDidMount () {
    const room = `room:${this.state.name}`
    bus.on(`${room}:join`, this.join.bind(this))
    bus.on(`${room}:leave`, this.leave.bind(this))
  }

  join (user) {
    this.setState({
      users: this.state.users.push(Immutable.fromJS(user))
    })
  }

  leave (user) {
    const index = this.state.users.findIndex(u => user.id == u.id)
    this.setState({
      users: this.state.users.delete(index)
    })
  }

  render () {
    return (
      <div className="room">
        <h1>Room: {this.props.name}</h1>
        {this.state.users.map(user => <User key={user.get('id')} data={user.toJS()} />)}
      </div>
    )
  }
}
