import createApp from './app'

export default (async () => {
  const { client } = await createApp()

  client.record.listen(
    'talk/[a-zA-Z0-9-_]+/user/[a-zA-Z0-9-_]+',
    (subject, response) => {
      response.accept()
      const [, talkId, , userId] = subject.split('/')

      const talk = client.record.getRecord(`talk/${talkId}`)

      talk.whenReady(() => {
        talk.set(`users.${userId}`, { id: userId })
      })

      response.onStop(() => {
        const users = talk.get('users')
        delete users[userId]
        talk.set('users', users)
        if (Object.keys(users).length === 0) talk.delete()
      })
    }
  )
})()
