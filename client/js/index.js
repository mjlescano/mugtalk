import bus from 'bus'
import React, { render } from 'react'
import Immutable from 'immutable'
import './connect'
import { join, getUsers } from './room'
import Room from './views/room'

window.Immutable = Immutable

bus.on('room:join', name => {
  getUsers(name).then(users => {
    render(<Room name={name} users={users} />, document.querySelector('body'));
  })
})

const room = 'default'

bus.on('room:leave', name => { console.log('room:leave', name) })
bus.on('room:join', name => { console.log('room:join', name) })
bus.on(`room:${room}:join`, user => { console.log(`room:${room}:join`, user) })
bus.on(`room:${room}:leave`, user => { console.log(`room:${room}:leave`, user) })

join(room)
