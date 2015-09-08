import React from 'react'
import Component from './component'

class User extends Component {
  render () {
    return <p>User: {this.props.user.id}</p>
  }
}

export default class UsersList extends Component {
  render () {
    return (
      <div className='users-list'>
        {Array.from(this.props.users.values()).map(user => {
          return <User key={user.id} user={user} />
        })}
      </div>
    )
  }
}
