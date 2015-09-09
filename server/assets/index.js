import { onProduction } from '../env'

export default require(onProduction ? './production': './development')
