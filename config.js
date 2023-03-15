module.exports = {
  MONGODB: process.env.MONGODB ,
  SECRET_KEY: process.env.SECRET_KEY || 'some very secret key',
  CLIENT: process.env.CLIENT || 'http://127.0.0.1:5173/'
}