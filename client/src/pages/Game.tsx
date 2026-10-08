import { useEffect, useState } from 'react'
import { Button } from 'primereact/button'
import Board from '../components/Board/Board'
import NextPiece from '../components/NextPiece/NextPiece'
import Spectrum from '../components/Spectrum/Spectrum'
import { createEmptyBoard } from '../game/board'
import { mergePiece, pieceToPreview, spawnPiece } from '../game/piece'
import { socket } from '../services/socket'
import { BOARD_COLS, type OpponentSpectrum, type PieceData } from '../types/tetris'
import type { PlayerData } from './Room'
import '../styles/game.scss'

const MAX_OPPONENTS = 4
const PIECES_BUFFER = 5

function buildOpponents(players: PlayerData[], playerName: string): OpponentSpectrum[] {
  return players
    .filter((player) => player.name !== playerName)
    .slice(0, MAX_OPPONENTS)
    .map((player) => ({
      playerName: player.name,
      isHost: player.isHost,
      isEliminated: player.lost ?? false,
      columnHeights: player.spectrum ?? Array<number>(BOARD_COLS).fill(0),
    }))
}

interface GameProps {
  roomName: string
  playerName: string
  players: PlayerData[]
  pieces: PieceData[]
  onLeaveGame: () => void
}

function Game({ roomName, playerName, players, pieces, onLeaveGame }: GameProps) {
  const [board] = useState(createEmptyBoard)
  const [pieceIndex] = useState(0)
  const [activePiece] = useState(() => (pieces[0] ? spawnPiece(pieces[0]) : null))
  const nextPiece = pieceToPreview(pieces[pieceIndex + 1])

  useEffect(() => {
    if (pieces.length > 0 && pieceIndex + PIECES_BUFFER >= pieces.length) {
      socket.emit('requestPieces', { room: roomName, startIndex: pieces.length })
    }
  }, [pieceIndex, pieces.length, roomName])
  const opponents = buildOpponents(players, playerName)

  return (
    <section id="game">
      <header className="game-header">
        <h1>Sala: {roomName}</h1>
        <Button label="Salir" onClick={onLeaveGame} severity="secondary" />
      </header>

      <div className="game-layout">
        <div className="game-main">
          <div className="game-main-info">
            <span className="game-player-name">{playerName}</span>
            <NextPiece grid={nextPiece} />
          </div>
          <Board grid={mergePiece(board, activePiece)} />
        </div>
        <aside className="game-opponents">
          <h2>Rivales</h2>
          <div className="game-opponents-grid">
            {opponents.map((opponent) => (
              <Spectrum key={opponent.playerName} opponent={opponent} />
            ))}
          </div>
        </aside>
      </div>
    </section>
  )
}

export default Game
