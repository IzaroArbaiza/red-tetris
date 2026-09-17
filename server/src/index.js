import express from 'express'
import http from 'node:http'
import { Server } from 'socket.io'
import { setupSocketEvents } from './socket/gameSocket.js'

const app = express()
const server = http.createServer(app)
const io = new Server(server)
const PORT = process.env.PORT || 3000

app.use(express.json())

app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok'
  })
})

setupSocketEvents(io)

server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`)
})
