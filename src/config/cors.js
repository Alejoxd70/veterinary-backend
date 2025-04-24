const allowedOrigins = [process.env.FRONT_END_URL]

export const corsOptions = {
  origin: function (origin, callback) {
    if (allowedOrigins.indexOf(origin) !== -1 || origin === undefined) {
      callback(null, true)
    } else {
      console.log('origin block: ', origin)
      callback(new Error('Not allowed by CORS'))
    }
  }
}
