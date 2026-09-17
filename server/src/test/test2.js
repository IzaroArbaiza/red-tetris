// server/src/test-second-player.js
import { io } from 'socket.io-client'

const socket = io('http://localhost:3000')

socket.on('connect', () => {
  console.log(`\n✅ ¡Jugador 2 Conectado! ID: ${socket.id}`)

  console.log('📡 Uniéndose a la sala "room42" como JugadorInvitado...')
  socket.emit('joinGame', {
    room: 'room42',
    playerName: 'JugadorInvitado'
  })
})

socket.on('gameUpdated', (data) => {
  console.log('\n📩 [Jugador 2] Estado de la sala:', data.status)
  console.log('Jugadores en la sala:', data.players.map(p => `${p.name} (Host: ${p.isHost})`))

  // Intentamos forzar el inicio de la partida siendo el jugador 2 (debería fallar)
  if (data.status === 'waiting') {
    console.log('⚠️ [Jugador 2] Intentando iniciar la partida sin ser HOST...')
    socket.emit('startGame', { room: 'room42' })
  }
})

socket.on('gameStarted', (data) => {
  console.log('\n🎮 [Jugador 2] ¡La partida ha comenzado para mí también!')
  console.log('Recibí las mismas piezas:', data.pieces.slice(0, 3))
})

socket.on('error', (err) => {
  console.log('🔴 [Jugador 2] Error recibido (Esperado):', err.message)
})