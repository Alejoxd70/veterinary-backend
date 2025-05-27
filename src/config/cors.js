const allowedOrigins = [process.env.FRONT_END_URL, 'http://localhost:5173']

export const corsOptions = {
  origin: function (origin, callback) {
    console.log('Checking origin:', origin)
    console.log('Allowed origins:', allowedOrigins)
    if (allowedOrigins.indexOf(origin) !== -1 || origin === undefined) {
      callback(null, true)
    } else {
      console.log('origin blocked:', origin)
      callback(new Error('Not allowed by CORS'))
    }
  },
  credentials: true,
  optionsSuccessStatus: 200,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'headers']
}
