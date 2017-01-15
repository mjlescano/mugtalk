import React from 'react'
import Head from 'next/head'
import { Provider } from 'react-redux'
import { initStore } from '../store'

export default class Layout extends React.Component {
  constructor (props) {
    super(props)
    this.store = initStore()
  }

  render () {
    return (
      <Provider store={this.store}>
        <div>
          <Head>
            <title>MugTalk.</title>
            <meta name='viewport' content='initial-scale=1.0, width=device-width' />
          </Head>
          <h1>Mugtalk</h1>
          { this.props.children }
        </div>
      </Provider>
    )
  }
}
