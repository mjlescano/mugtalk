import createApp from './app'

export default (async () => {
  const { client } = await createApp()

  client.presence.subscribe((user, isOnline) => {
    console.log({ user, isOnline })
  })
})()
