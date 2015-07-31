import bus from 'bus'
import React, { render } from 'react'
import { connect } from './socket'
import { join, getUsers } from './room'
import Room from './views/room'

const room = 'default'

bus.on('room:leave', name => { console.log('room:leave', name) })
bus.on('room:join', name => { console.log('room:join', name) })
bus.on(`room:${room}:join`, user => { console.log(`room:${room}:join`, user) })
bus.on(`room:${room}:leave`, user => { console.log(`room:${room}:leave`, user) })

join(room).then(getUsers).then(users => {
  let container = document.querySelector('body')
  render(<Room name={name} users={users} />, container)
}).catch(err => console.log(`cannot join ${room}`, err))
