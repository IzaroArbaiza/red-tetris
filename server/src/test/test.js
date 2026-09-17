// server/test-client.js
import { io } from 'socket.io-client'

const socket = io('http://localhost:3000')

socket.on('connect', () => {
  console.log(`\n✅ ¡Conectado! ID: ${socket.id}`)

  console.log('📡 Enviando "joinGame"...')
  socket.emit('joinGame', {
    room: 'room42',
    playerName: 'JugadorHost'
  })
})

socket.on('gameUpdated', (data) => {
  console.log('\n📩 Lista de jugadores actualizada. Estado:', data.status)

  // Si la partida está en espera y somos el host, pedimos iniciar la partida tras 1 segundo
  if (data.status === 'waiting') {
    setTimeout(() => {
      console.log('🚀 Enviando evento "startGame"...')
      socket.emit('startGame', { room: 'room42' })
    }, 1000)
  }
})

// Escuchamos el evento cuando la partida arranca con éxito
socket.on('gameStarted', (data) => {
  console.log('\n🎮 ¡LA PARTIDA HA COMENZADO!')
  console.log('--------------------------------------------')
  console.log('Estado:', data.status)
  console.log('Primeras 5 piezas recibidas:', data.pieces.slice(0, 5))
  console.log('--------------------------------------------')

  setTimeout(() => {
    socket.disconnect()
  }, 2000)
})

socket.on('error', (err) => {
  console.error('❌ Error:', err)
})