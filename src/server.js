import express from 'express'
import { SERVER_PORT } from '../app.config.json'

const app = express()

app.use(express.static('.'))
app.listen(SERVER_PORT)

export default app
