import { useState, useEffect } from 'react'
import useClient, { User } from './use-client'

interface UserMap {
  [username: string]: User
}

const useTalk = (talkId) => {
  const { client, currentUser, isOnline } = useClient()
  const [users, setUsers] = useState<UserMap>({})

  useEffect(() => {
    if (isOnline) {
      let talk
      const presence = client.record.getRecord(
        `talk/${talkId}/user/${currentUser.username}`
      )

      presence.on('error', (err) => {
        console.error(`talk/${talkId}/user/${currentUser.username}`, err)
      })

      presence.whenReady(() => {
        talk = client.record.getRecord(`talk/${talkId}`)

        talk.on('error', (err) => {
          console.error(`talk/${talkId}`, err)
        })

        talk.subscribe('users', (users = {}) => setUsers(users), true)
      })

      return () => {
        presence.discard()
        if (talk) talk.discard()
      }
    }
  }, [isOnline])

  return { users }
}

export default useTalk
