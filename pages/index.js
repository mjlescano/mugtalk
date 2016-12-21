import React from 'react'
import { initStore } from '../store'
import talk from '../store/talk'
import Layout from '../components/Layout'
import Talk from '../components/Talk'

export default class Home extends React.Component {
  componentDidMount () {
    const store = initStore()

    talk.connect({
      store,
      name: 'default'
    })
  }

  render () {
    return (
      <Layout>
        <Talk />
      </Layout>
    )
  }
}
