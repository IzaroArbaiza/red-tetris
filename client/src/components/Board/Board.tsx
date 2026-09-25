import { BOARD_COLS, BOARD_ROWS, type BoardGrid } from '../../types/tetris'
import '../../styles/board.scss'

interface BoardProps {
  grid: BoardGrid
}

function Board({ grid }: BoardProps) {
  return (
    <div
      className="board"
      style={{ gridTemplateColumns: `repeat(${BOARD_COLS}, 1fr)`, gridTemplateRows: `repeat(${BOARD_ROWS}, 1fr)` }}
    >
      {grid.map((row, rowIndex) =>
        row.map((cell, colIndex) => (
          <div
            key={`${rowIndex}-${colIndex}`}
            className={`board-cell${cell ? ` cell-${cell}` : ''}`}
          />
        )),
      )}
    </div>
  )
}

export default Board
