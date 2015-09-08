import 'babelify/polyfill'
import React, { render } from 'react'
import { connect } from './socket'
import { join, getUsers } from './talks'
import Talk from './components/talk'
import Alert from './components/alert'

const talk = 'default'
const container = document.querySelector('[data-mugtalk]')

join(talk).then(getUsers).then(users => {
  render(<Talk name={talk} talk={`talks:${talk}`} users={users} />, container)
}).catch(err => {
  console.error(err)
  const msg = `Cannot join "${talk}", try again later please.`
  render(<Alert message={msg} />, container)
}).then(() => {
  container.classList.remove('loading')
})
