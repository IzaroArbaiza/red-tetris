import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { socket } from '../services/socket'
import Lobby from './Lobby'
import Game from './Game'

export interface PlayerData {
  id: string
  name: string
  isHost: boolean
}

type RoomPhase = 'waiting' | 'playing'

function Room() {
  const { roomName, playerName } = useParams<{ roomName: string; playerName: string }>()
  const navigate = useNavigate()

  const [phase, setPhase] = useState<RoomPhase>('waiting')
  const [players, setPlayers] = useState<PlayerData[]>([])
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  useEffect(() => {
    if (!roomName || !playerName) return

    const handleConnect = () => {
      socket.emit('joinGame', { room: roomName, playerName })
    }
    socket.on('gameUpdated', (data: { players: PlayerData[]; status: RoomPhase }) => {
      setErrorMessage(null)
      setPlayers(data.players)
      setPhase(data.status)
    })
    socket.on('gameStarted', () => {
      setPhase('playing')
    })
    socket.on('error', (err: { message: string }) => {
      setErrorMessage(err.message)
    })

    if (socket.connected) {
      handleConnect()
    } else {
      socket.on('connect', handleConnect)
      socket.connect()
    }

    return () => {
      socket.off('connect', handleConnect)
      socket.off('gameUpdated')
      socket.off('gameStarted')
      socket.off('error')
      socket.disconnect()
    }
  }, [roomName, playerName])

  if (errorMessage) {
    return (
      <div style={{ textAlign: 'center', marginTop: '2rem' }}>
        <h2>Error: {errorMessage}</h2>
        <button onClick={() => navigate('/')}>Volver al inicio</button>
      </div>
    )
  }

  if (phase === 'playing') {
    return <Game onLeaveGame={() => setPhase('waiting')} />
  }

  return (
    <Lobby
      players={players}
      currentSocketId={socket.id}
      onStartGame={() => socket.emit('startGame', { room: roomName })}
      onLeave={() => navigate('/')}
    />
  )
}

export default Room