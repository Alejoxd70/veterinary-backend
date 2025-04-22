import express from 'express'
import cors from 'cors'
import userRoutes from './routes/user.routes.js'
import { corsOptions } from './config/cors.js'

const app = express()

app.use(express.json())

app.use(cors(corsOptions))

app.use('/api', userRoutes)

const PORT = process.env.PORT || 4000
app.listen(3000, () => {
  console.log(`Server is running on port http://localhost:${PORT}`)
})
