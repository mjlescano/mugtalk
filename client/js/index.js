import bus from 'bus'
import React, { render } from 'react'
import { connect } from './socket'
import { join, getUsers } from './talks'
import Talk from './views/talk'

const talk = 'default'

bus.on('talks:leave', name => { console.log('talks:leave', name) })
bus.on('talks:join', name => { console.log('talks:join', name) })
bus.on(`talks:${talk}:join`, user => { console.log(`talks:${talk}:join`, user) })
bus.on(`talks:${talk}:leave`, user => { console.log(`talks:${talk}:leave`, user) })

join(talk).then(getUsers).then(users => {
  let container = document.querySelector('body')
  render(<Talk name={talk} users={users} />, container)
}).catch(err => console.log(`cannot join ${talk}`, err))
