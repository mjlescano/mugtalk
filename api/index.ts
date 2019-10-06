import path from 'path'
import { Deepstream } from '@deepstream/server'
// const { Deepstream } = require('@deepstream/server')

const server = new Deepstream(path.join(__dirname, 'config.yml'))

server.start()

export default server
