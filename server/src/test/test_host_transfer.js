// server/src/test-host-transfer.js
import { io } from 'socket.io-client'

// Creamos la conexión del Host
const hostSocket = io('http://localhost:3000')

hostSocket.on('connect', () => {
  console.log('1️⃣ Host conectado. Uniéndose a "roomTransfer"...')
  hostSocket.emit('joinGame', { room: 'roomTransfer', playerName: 'Alice' })
})

hostSocket.on('gameUpdated', (data) => {
  console.log('📩 [Host] Lista de jugadores recibida. Cantidad:', data.players.length)

  // Una vez que el Host entra, conectamos al Jugador 2
  if (data.players.length === 1) {
    connectSecondPlayer()
  }
})

function connectSecondPlayer() {
  const player2Socket = io('http://localhost:3000')

  player2Socket.on('connect', () => {
    console.log('2️⃣ Jugador 2 conectado. Uniéndose a "roomTransfer"...')
    player2Socket.emit('joinGame', { room: 'roomTransfer', playerName: 'Bob' })
  })

  player2Socket.on('gameUpdated', (data) => {
    console.log('📩 [Jugador 2] Actualización recibida.')
    const me = data.players.find(p => p.name === 'Bob')
    console.log(`   --> ¿Soy Bob el Host? ${me?.isHost}`)

    // Si somos 2 en la sala, desconectamos a Alice (Host) para ver si Bob pasa a ser Host
    if (data.players.length === 2 && !me.isHost) {
      console.log('⚠️ Desconectando al Host (Alice)...')
      hostSocket.disconnect()
    }

    // Si Alice se fue y Bob se convirtió en Host, ¡prueba superada!
    if (data.players.length === 1 && me?.isHost) {
      console.log('🎉 ¡ÉXITO! Bob es ahora el nuevo HOST automáticamente.')
      player2Socket.disconnect()
    }
  })
}