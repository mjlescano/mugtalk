import { createServer } from 'http'
import { app, io } from './app'
import client from './client'

app.use(client)

const server = createServer(app.callback())
io.attach(server, { serveClient: false })

export default server
