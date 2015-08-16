import React, { render } from 'react'
import { connect } from './socket'
import { join, getUsers } from './talks'
import Talk from './views/talk'

const talk = 'default'

join(talk).then(getUsers).then(users => {
  let container = document.querySelector('body')
  render(<Talk name={talk} users={users} />, container)
}).catch(err => {
  console.error(err)
  alert(`Cannot join "${talk}", try again later please.`, err)
})
