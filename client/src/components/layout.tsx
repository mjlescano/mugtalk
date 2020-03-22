import React from 'react'
import classNames from '@sindresorhus/class-names'
import Head from 'next/head'

interface PropTypes {
  className?: string
}

export default function Layout ({
  className,
  children
}: React.PropsWithChildren<PropTypes>) {
  return (
    <div className={classNames(className)}>
      <Head>
        <meta charSet='utf-8' />
        <meta httpEquiv='X-UA-Compatible' content='IE=edge' />
        <meta name='viewport' content='initial-scale=1.0, width=device-width' />
        <meta name='description' content='talk. here.' />
        <title>talk.</title>
      </Head>
      {children}
    </div>
  )
}
