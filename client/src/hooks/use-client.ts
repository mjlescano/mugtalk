import { DeepstreamClient } from '@deepstream/client'
import { useState, useEffect } from 'react'
import store from 'store/dist/store.modern'

export type CONNECTION_STATE =
  | 'INITIALIZING'
  | 'CONNECTING'
  | 'OFFLINE'
  | 'ONLINE'
  | 'ERROR'

export interface User {
  username: string
}

const API_URL = process.env.API_URL || 'ws://localhost:6020'

function getCurrentUser (client: DeepstreamClient): User {
  const currentUser = store.get('currentUser')

  if (!currentUser) {
    const newUser = { username: client.getUid() }
    store.set('currentUser', newUser)
    return newUser
  }

  return currentUser
}

function getConnectionState (): CONNECTION_STATE {
  if (!client) return 'INITIALIZING'

  switch (client.getConnectionState()) {
    case 'CLOSED':
    case 'RECONNECTING':
      return 'OFFLINE'
    case 'AWAITING_CONNECTION':
    case 'CHALLENGING':
    case 'AWAITING_AUTHENTICATION':
    case 'AUTHENTICATING':
      return 'CONNECTING'
    case 'OPEN':
      return 'ONLINE'
    case 'ERROR':
      return 'ERROR'
    default:
      return 'INITIALIZING'
  }
}

const onServer = typeof window === 'undefined'

const client = onServer ? null : new DeepstreamClient(API_URL)

const currentUser = onServer ? null : (client && getCurrentUser(client))

declare global {
  interface Window { c: DeepstreamClient | null }
}

if (typeof window !== 'undefined') {
  window.c = client
}

export default function useClient (): {
  clientState: CONNECTION_STATE
  isOnline: boolean
  currentUser: User | null
  client: DeepstreamClient | null
} {
  const [clientState, setClientState] = useState<CONNECTION_STATE>(
    getConnectionState()
  )
  const [isOnline, setIsOnline] = useState<boolean>(clientState === 'ONLINE')

  if (client === null) {
    return { clientState, client, currentUser, isOnline }
  }

  if (currentUser === null) {
    throw new Error('Missing currentUser when loading client')
  }

  if (clientState === 'INITIALIZING') {
    client.login({ username: currentUser.username })
  }

  useEffect(() => {
    const handleStatusChange = () => {
      const connState = getConnectionState()
      setClientState(connState)
      setIsOnline(connState === 'ONLINE')
    }

    client.on('connectionStateChanged', handleStatusChange)
    return () => {
      client.off('connectionStateChanged', handleStatusChange)
    }
  }, [client])

  return { clientState, client, currentUser, isOnline }
}
