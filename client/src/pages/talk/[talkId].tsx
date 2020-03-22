import React from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import useClient, { CONNECTION_STATE } from '../../hooks/use-client'
import useTalk from '../../hooks/use-talk'
import useMessages from '../../hooks/use-messages'
import MessageForm from '../../components/message-form'
import map from '../../lib/map'

const getClientStateTitle = (clientState: CONNECTION_STATE) => {
  switch (clientState) {
    case 'INITIALIZING':
      return 'Initializing...'
    case 'CONNECTING':
      return 'Connecting...'
    case 'ONLINE':
      return 'Online'
    case 'OFFLINE':
      return 'Offline'
    case 'ERROR':
      return 'Error'
  }
}

function getTalkId () {
  const { talkId } = useRouter().query

  if (talkId === undefined) return null

  if (typeof talkId !== 'string' || !/[A-Za-z0-9_-]+/g.test(talkId)) {
    throw new Error(`Invalid talkId "${talkId}"`)
  }

  return talkId
}

export default function Page () {
  const talkId = getTalkId()

  if (talkId === null) return null

  const { client, isOnline, clientState, currentUser } = useClient()

  if (client === null) return null
  if (currentUser === null) throw new Error('Missing currentUser')

  const { users, talkReady } = useTalk({
    talkId,
    client,
    currentUser,
    isOnline
  })
  const { messages, submitMessage } = useMessages({ talkId, client, talkReady })

  return (
    <>
      <div>
        <Link href="/">
          <a>
            <sub>← Back</sub>
          </a>
        </Link>
      </div>
      <br />
      <div>
        <strong>Talk:</strong> {talkId}
      </div>
      <div>
        <strong>Status:</strong> {getClientStateTitle(clientState)}
      </div>
      <br />
      {talkReady && (
        <>
          <div>
            <strong>Users:</strong>
          </div>
          <ul>
            {Object.values(users).map(({ username }) => (
              <li key={username}>{username}</li>
            ))}
          </ul>
        </>
      )}
      {messages.size > 0 && (
        <>
          <div>
            <strong>Messages:</strong>
          </div>
          <ul>
            {map(messages, ([key, msg]) => (
              <li key={key}>{msg.m}</li>
            ))}
          </ul>
        </>
      )}
      {talkReady && currentUser && (
        <MessageForm username={currentUser.username} onSubmit={submitMessage} />
      )}
    </>
  )
}
