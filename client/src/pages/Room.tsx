import { useEffect, useRef, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Toast } from 'primereact/toast'
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
  const toastRef = useRef<Toast>(null)

  const [phase, setPhase] = useState<RoomPhase>('waiting')
  const [players, setPlayers] = useState<PlayerData[]>([])

  useEffect(() => {
    if (!roomName || !playerName) return

    const handleConnect = () => {
      socket.emit('joinGame', { room: roomName, playerName })
    }
    socket.on('gameUpdated', (data: { players: PlayerData[]; status: RoomPhase }) => {
      setPlayers(data.players)
      setPhase(data.status)
    })
    socket.on('gameStarted', () => {
      setPhase('playing')
    })
    socket.on('error', (err: { message: string }) => {
      toastRef.current?.show({
        severity: 'error',
        summary: 'Error',
        detail: err.message,
        life: 3000,
      })
      setTimeout(() => {}, 5000)
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
  }, [roomName, playerName, navigate])

  const handleLeaveRoom  = () => {
    socket.disconnect()
    navigate('/')
  }

  if (phase === 'playing') {
    return (
      <>
        <Toast ref={toastRef} position="top-right"/>
        <Game
          roomName={roomName ?? ''}
          playerName={playerName ?? ''}
          players={players}
          onLeaveGame={handleLeaveRoom}
        />
      </>
    )
  }

  return (
    <>
      <Toast ref={toastRef} position="top-right"/>
      <Lobby
        players={players}
        currentSocketId={socket.id}
        onStartGame={() => socket.emit('startGame', { room: roomName })}
        onLeave={handleLeaveRoom}
      />
    </>
  )
}

export default Room