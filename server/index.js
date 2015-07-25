import { createServer } from 'http'
import app from './app'
import io from './io'

const server = createServer(app.callback())
io.attach(server, { serveClient: false })

export default server
