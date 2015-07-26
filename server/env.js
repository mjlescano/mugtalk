const env = process.env.NODE_ENV || 'development'

export default env
export const onDevelopment = 'development' == env
export const onProduction = 'production' == env
export const jwtSecret = process.env.JWT_SECRET || 'development-jwt-secret'
