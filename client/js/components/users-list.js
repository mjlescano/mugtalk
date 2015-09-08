import React from 'react'
import Component from './component'

export default class UsersList extends Component {
  render () {
    return (
      <div className='users-list'>
        <p>{Array.from(this.props.users.values()).map(u => u.id).join(', ')}</p>
      </div>
    )
  }
}
