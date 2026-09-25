import { useState } from 'react'
import Lobby from './Lobby'
import Game from './Game'

type RoomPhase = 'waiting' | 'playing'

function Room() {
  const [phase, setPhase] = useState<RoomPhase>('waiting')

  if (phase === 'playing') {
    return <Game onLeaveGame={() => setPhase('waiting')} />
  }

  return <Lobby onPlay={() => setPhase('playing')} />
}

export default Room
