import { app, server } from './app'
import client from './client'

app.use(client)

export default server
