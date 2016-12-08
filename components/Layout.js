import React from 'react'
import Head from 'next/head'

export default (props) => (
  <div>
    <Head>
      <title>MugTalk.</title>
      <meta name="viewport" content="initial-scale=1.0, width=device-width" />
    </Head>
    {props.children}
  </div>
)
