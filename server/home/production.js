import { join } from 'path'
import sendfile from 'koa-sendfile'

const file = join(process.cwd(), 'build', 'index.html')

export default function *(){
  yield* sendfile.call(this, file)
  if (!this.status) this.throw(500)
}
