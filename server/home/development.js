import { join } from 'path'
import jade from 'jade'
import { onDevelopment } from '../env'

const file = join(process.cwd(), 'client', 'index.jade')

export default function *(){
  this.body = jade.compileFile(file)({
    onDevelopment: onDevelopment
  })
}
