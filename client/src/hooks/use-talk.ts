import { useState, useEffect } from 'react'
import { DeepstreamClient } from '@deepstream/client'
import { Record as DeepstreamRecord } from '@deepstream/client/dist/record/record'
import { User } from './use-client'

interface UserMap {
  [username: string]: User
}

export default function useTalk ({
  talkId,
  client,
  isOnline,
  currentUser
}: {
  talkId: string
  client: DeepstreamClient
  isOnline: boolean
  currentUser: User
}) {
  const [users, setUsers] = useState<UserMap>({})
  const [talkReady, setTalkReady] = useState<boolean>(false)

  useEffect(() => {
    if (isOnline === false) return

    let talk: DeepstreamRecord | null = null
    const presence = client.record.getRecord(
      `talk/${talkId}/presence/${currentUser.username}`
    )

    presence.on('error', (err: Error) => {
      console.error(`talk/${talkId}/presence/${currentUser.username}`, err)
    })

    presence.whenReady(() => {
      setTimeout(() => {
        talk = client.record.getRecord(`talk/${talkId}`) as DeepstreamRecord

        if (!talk) throw new Error(`Record not found`)

        talk.on('error', (err: Error) => {
          console.error(`talk/${talkId}`, err)
        })

        talk.whenReady(() => {
          if (!talk) throw new Error(`Record not found`)
          talk.subscribe('users', (users = {}) => setUsers(users), true)
          setTalkReady(true)
        })
      }, 500)
    })

    return () => {
      presence.discard()
      if (talk) talk.discard()
      setTalkReady(false)
    }
  }, [isOnline])

  return { users, talkReady }
}
