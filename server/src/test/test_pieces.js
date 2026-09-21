// server/src/test-pieces.js
import { io } from 'socket.io-client'

const p1 = io('http://localhost:3000')
const p2 = io('http://localhost:3000')

let room = 'roomPieces'

p1.on('connect', () => {
  p1.emit('joinGame', { room, playerName: 'Player1' })
})

p1.on('gameUpdated', (data) => {
  if (data.players.length === 1) {
    p2.emit('joinGame', { room, playerName: 'Player2' })
  } else if (data.players.length === 2 && data.status === 'waiting') {
    p1.emit('startGame', { room })
  }
})

p1.on('gameStarted', (data) => {
  console.log('🎮 Partida iniciada. Piezas iniciales recibidas por P1:', data.pieces.length)
  
  // Simulamos que P1 avanza rápido y pide más piezas a partir de la número 20
  console.log('📡 P1 pide más piezas a partir del índice 20...')
  p1.emit('requestPieces', { room, startIndex: 20 })
})

p1.on('morePieces', (data) => {
  console.log(`✅ P1 recibió piezas desde índice ${data.startIndex}:`, data.pieces.map(p => p.type))

  // Ahora simulamos que P2 alcanza el índice 20 más tarde
  console.log('📡 P2 pide más piezas a partir del índice 20...')
  p2.emit('requestPieces', { room, startIndex: 20 })
})

p2.on('morePieces', (data) => {
  console.log(`✅ P2 recibió piezas desde índice ${data.startIndex}:`, data.pieces.map(p => p.type))
  console.log('🎉 ¡Prueba completada! Ambos jugadores reciben la misma secuencia de piezas.')
  
  p1.disconnect()
  p2.disconnect()
})