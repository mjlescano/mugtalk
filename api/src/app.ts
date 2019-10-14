const deepstream = require('@deepstream/client')
import path from 'path'
import { Deepstream } from '@deepstream/server'
import { Client as DeepstreamClient } from '@deepstream/client'
import waitForEvent from './lib/wait-for-event'

const API_URL = process.env.API_URL || 'ws://127.0.0.1:6020'

export default async () => {
  const server = new Deepstream(path.join(__dirname, 'conf', 'config.yml'))
  const client: DeepstreamClient = deepstream(API_URL)

  server.start()

  await waitForEvent(server, 'started')

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
