const deepstream = require('@deepstream/client')
import { Client as DeepstreamClient } from '@deepstream/client'
import { useState, useEffect } from 'react'
import store from 'store/dist/store.modern'

export type CONNECTION_STATE =
  | 'INITIALIZING'
  | 'CONNECTING'
  | 'OFFLINE'
  | 'ONLINE'
  | 'ERROR'

export interface User {
  id: string
}

const getCurrentUser = () => {
  if (typeof window === 'undefined') return null
  const currentUser = store.get('currentUser')

  if (!currentUser) {
    const newUser = { id: client.getUid() }
    store.set('currentUser', newUser)
    return newUser
  }

  return currentUser
}

const getConnectionState = (): CONNECTION_STATE => {
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

const client: DeepstreamClient =
  typeof window === 'undefined' ? null : deepstream('ws://localhost:6020')

const currentUser: User =
  typeof window === 'undefined' ? null : getCurrentUser()

if (typeof window !== 'undefined') {
  globalThis.c = client
}

const useClient = (): {
  clientState: CONNECTION_STATE
  isOnline: boolean
  currentUser: User
  client?: DeepstreamClient
} => {
  const [clientState, setClientState] = useState<CONNECTION_STATE>(
    getConnectionState()
  )
  const [isOnline, setIsOnline] = useState<boolean>(clientState === 'ONLINE')

  if (client === null) {
    return { clientState, client, currentUser, isOnline }
  }

  if (clientState === 'INITIALIZING') {
    client.login({ id: currentUser.id })
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

export default useClient
