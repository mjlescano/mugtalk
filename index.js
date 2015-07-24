import server from './server'

const port = 3000

server.listen(3000, () => {
  console.log(` · ${port} · `)
})
