import createApp from './app'

export default (async () => {
  const { client } = await createApp()

  // User presence on talks
  client.record.listen(
    'talk/[a-zA-Z0-9-_]+/presence/[a-zA-Z0-9-_]+',
    (subject, response) => {
      response.accept()
      const [, talkId, , username] = subject.split('/')

      const talk = client.record.getRecord(`talk/${talkId}`)

      talk.whenReady(() => {
        talk.set(`users.${username}`, { username: username })
      })

      response.onStop(() => {
        const users = talk.get('users')
        delete users[username]
        talk.set('users', users)
        if (Object.keys(users).length === 0) talk.delete()
      })
    }
  )
})().catch((err) => {
  console.error(err)
  process.exit(1)
})
