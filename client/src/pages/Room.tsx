import { useEffect, useRef, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Toast } from 'primereact/toast'
import { socket } from '../services/socket'
import type { PieceData } from '../types/tetris'
import Lobby from './Lobby'
import Game from './Game'

export interface PlayerData {
  id: string
  name: string
  isHost: boolean
  spectrum?: number[]
  lost?: boolean
}

type RoomPhase = 'waiting' | 'playing'

function Room() {
  const { roomName, playerName } = useParams<{ roomName: string; playerName: string }>()
  const navigate = useNavigate()
  const toastRef = useRef<Toast>(null)

  const [phase, setPhase] = useState<RoomPhase>('waiting')
  const [players, setPlayers] = useState<PlayerData[]>([])
  const [pieces, setPieces] = useState<PieceData[]>([])
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  useEffect(() => {
    if (!roomName || !playerName) {
      navigate('/')
      return
    }
    const handleConnect = () => {
      socket.emit('joinGame', { room: roomName, playerName })
    }
    socket.on('gameUpdated', (data: { players: PlayerData[]; status: RoomPhase }) => {
      setErrorMessage(null)
      setPlayers(data.players)
      setPhase(data.status)
    })
    socket.on('gameStarted', (data: { pieces: PieceData[] }) => {
      console.log('[Pieces] gameStarted:', data.pieces.map((p) => p.type).join(' '))
      setPieces(data.pieces)
      setPhase('playing')
    })
    // Pieces come from the room's shared sequence, so they are placed by index
    socket.on('morePieces', (data: { startIndex: number; pieces: PieceData[] }) => {
      console.log(`[Pieces] morePieces from ${data.startIndex}:`, data.pieces.map((p) => p.type).join(' '))
      setPieces((prev) => {
        const next = [...prev]
        data.pieces.forEach((piece, i) => {
          next[data.startIndex + i] = piece
        })
        return next
      })
    })
    socket.on('error', (err: { message: string }) => {
      setErrorMessage(err.message)
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
      socket.off('morePieces')
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
          pieces={pieces}
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
        hasError={!!errorMessage} //True if there is an error
        onStartGame={() => socket.emit('startGame', { room: roomName })}
        onLeave={handleLeaveRoom}
      />
    </>
  )
}

export default Room
