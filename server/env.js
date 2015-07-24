const env = process.env.NODE_ENV || 'development'

export default env
export const onDevelopment = 'development' == env
export const onProduction = 'production' == env
