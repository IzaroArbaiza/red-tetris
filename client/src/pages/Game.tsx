import { Button } from 'primereact/button'
import Board from '../components/Board/Board'
import NextPiece from '../components/NextPiece/NextPiece'
import Spectrum from '../components/Spectrum/Spectrum'
import { BOARD_COLS, BOARD_ROWS, type BoardGrid, type Cell, type OpponentSpectrum } from '../types/tetris'
import type { PlayerData } from './Room'
import '../styles/game.scss'

const MAX_OPPONENTS = 4

function buildMockBoard(): BoardGrid {
  const grid: BoardGrid = Array.from({ length: BOARD_ROWS }, () => Array<Cell>(BOARD_COLS).fill(null))

  const tPiece: Array<[number, number]> = [
    [0, 4],
    [1, 3],
    [1, 4],
    [1, 5],
  ]
  tPiece.forEach(([row, col]) => {
    grid[row][col] = 'purple'
  })

  return grid
}

function buildMockNextPiece(): Cell[][] {
  const grid: Cell[][] = Array.from({ length: 4 }, () => Array<Cell>(4).fill(null))
  grid[1][0] = 'green'
  grid[1][1] = 'green'
  grid[2][1] = 'green'
  grid[2][2] = 'green'
  return grid
}

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
  onLeaveGame: () => void
}

function Game({ roomName, playerName, players, onLeaveGame }: GameProps) {
  const board = buildMockBoard()
  const nextPiece = buildMockNextPiece()
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
          <Board grid={board} />
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
