import bus from 'bus'
import React from 'react'
import Component from './component'
import Immutable from 'immutable'

class User extends Component {
  render () {
    return <p>User: {this.props.data.id}</p>
  }
}

export default class Talk extends Component {
  constructor (props) {
    super(props);

    this.state = {
      users: Immutable.fromJS(props.users)
    }

    this.props.talk = `talks:${this.props.name}`

    this._bind('join', 'leave')
  }

  componentDidMount () {
    bus.on(`${this.props.talk}:join`, this.join)
    bus.on(`${this.props.talk}:leave`, this.leave)
  }

  componentWillUnmount () {
    bus.off(`${this.props.talk}:join`, this.join)
    bus.off(`${this.props.talk}:leave`, this.leave)
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
      <div className="talk">
        <h1>Talk: {this.props.name}</h1>
        {this.state.users.map(user => <User key={user.get('id')} data={user.toJS()} />)}
      </div>
    )
  }
}
