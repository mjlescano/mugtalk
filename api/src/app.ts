import path from 'path'
import { Deepstream } from '@deepstream/server'
import { DeepstreamClient } from '@deepstream/client'
import waitForEvent from './lib/wait-for-event'

const API_URL = process.env.API_URL || 'ws://127.0.0.1:6020'

export default async () => {
  const server = new Deepstream(path.join(__dirname, 'conf', 'config.yml'))
  // const server = new Deepstream({
  //   serverName: 'UUID',
  //   showLogo: false,
  //   exitOnFatalError: true,
  //   permission: {
  //     type: 'none'
  //   }
  // })

  server.start()

  await waitForEvent(server, 'started')

  const client = new DeepstreamClient(API_URL)

  await new Promise((resolve, reject) => {
    client.login({ username: 'api' }, (success) => {
      if (success) {
        resolve(client)
      } else {
        reject(new Error('Api Client could not login'))
      }
    })
  })

  return { server, client }
}
