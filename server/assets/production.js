import { join } from 'path'

const server = require('koa-static-cache')({
  buffer: true,
  gzip: true,
  usePrecompiledGzip: true,
  dynamic: false,
  maxAge: 60 * 60 * 24 * 365,
  dir: join(process.cwd(), 'build')
}, {})

export default server
