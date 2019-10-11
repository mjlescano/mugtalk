import { useState, useEffect } from 'react'
import useClient, { User } from './use-client'

interface UserMap {
  [id: string]: User
}

const useTalk = (talkId) => {
  const { client, currentUser, isOnline } = useClient()
  const [users, setUsers] = useState<UserMap>({})

  useEffect(() => {
    if (isOnline) {
      const talk = client.record.getRecord(`talk/${talkId}`)
      const record = client.record.getRecord(
        `talk/${talkId}/user/${currentUser.id}`
      )

      talk.on('error', (err) => {
        console.error(err)
      })

      record.on('error', (err) => {
        console.error(err)
      })

      talk.subscribe('users', (users = {}) => setUsers(users), true)

      return () => {
        talk.discard()
        record.discard()
      }
    }
  }, [isOnline])

  return { users }
}

export default useTalk
