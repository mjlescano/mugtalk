import { useState, useEffect } from 'react'
import useClient, { User } from './use-client'

interface UserMap {
  [username: string]: User
}

const useTalk = (guid) => {
  const { client, currentUser, isOnline } = useClient()
  const [ready, setReady] = useState<boolean>(false)
  const [users, setUsers] = useState<UserMap>({})

  useEffect(() => {
    const record = client.record.getRecord(`talk/${guid}`)

    record.whenReady(() => {
      setReady(true)
    })

    record.on('error', (err) => {
      console.error(err)
    })

    record.subscribe(
      'users',
      (users: UserMap = {}) => {
        setUsers(users)
      },
      true
    )

    record.set(`users.${currentUser.username}`, currentUser as any)

    return () => {
      record.set(`users.${currentUser.username}`, null, () => {
        record.discard()
      })
    }
  }, [isOnline])

  return { ready, users }
}

export default useTalk
