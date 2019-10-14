import { useState, useEffect } from 'react'
import { Client as DeepstreamClient } from '@deepstream/client'
import { User } from './use-client'

interface UserMap {
  [username: string]: User
}

const useTalk = ({
  talkId,
  client,
  isOnline,
  currentUser
}: {
  talkId: string
  client: DeepstreamClient
  isOnline: boolean
  currentUser: User
}) => {
  const [users, setUsers] = useState<UserMap>({})
  const [talkReady, setTalkReady] = useState<boolean>(false)

  useEffect(() => {
    if (isOnline === false) return

    let talk
    const presence = client.record.getRecord(
      `talk/${talkId}/presence/${currentUser.username}`
    )

    presence.on('error', (err) => {
      console.error(`talk/${talkId}/presence/${currentUser.username}`, err)
    })

    presence.whenReady(() => {
      setTimeout(() => {
        talk = client.record.getRecord(`talk/${talkId}`)

        talk.on('error', (err) => {
          console.error(`talk/${talkId}`, err)
        })

        talk.whenReady(() => {
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

export default useTalk
