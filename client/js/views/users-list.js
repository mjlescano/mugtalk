import React from 'react'
import Component from './component'

class User extends Component {
  render () {
    return <p data-id={this.props.id}>User: {this.props.data.id}</p>
  }
}

export default class UsersList extends Component {
  constructor (props) {
    super(props)
  }

  render () {
    return (
      <div className="users-list">
        <h1>Talk: {this.props.name}</h1>
        {this.props.users.map(user => {
          return <User id={user.get('id')} data={user.toJS()} />
        })}
      </div>
    )
  }
}
