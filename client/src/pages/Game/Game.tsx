import { useParams } from 'react-router-dom'
import { Button } from 'primereact/button'
import Board from '../../components/Board/Board'
import NextPiece from '../../components/NextPiece/NextPiece'
import Spectrum from '../../components/Spectrum/Spectrum'
import { BOARD_COLS, BOARD_ROWS, type BoardGrid, type Cell, type OpponentSpectrum } from '../../types/tetris'
import './Game.css'

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

function buildMockOpponents(): OpponentSpectrum[] {
  return [
    { playerName: 'Player2', isHost: true, isEliminated: false, columnHeights: [2, 4, 3, 5, 1, 0, 2, 6, 3, 4] },
    { playerName: 'Player3', isHost: false, isEliminated: false, columnHeights: [1, 1, 3, 2, 4, 5, 3, 2, 1, 0] },
    { playerName: 'Player4', isHost: false, isEliminated: true, columnHeights: [8, 9, 10, 12, 11, 9, 8, 10, 12, 13] },
    { playerName: 'Player5', isHost: false, isEliminated: false, columnHeights: [0, 0, 1, 2, 1, 0, 0, 1, 2, 1] },
  ].slice(0, MAX_OPPONENTS)
}

interface GameProps {
  onLeaveGame: () => void
}

function Game({ onLeaveGame }: GameProps) {
  const { roomName, playerName } = useParams()

  const board = buildMockBoard()
  const nextPiece = buildMockNextPiece()
  const opponents = buildMockOpponents()

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
