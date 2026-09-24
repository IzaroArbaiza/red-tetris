import type { Cell } from '../../types/tetris'
import './NextPiece.css'

interface NextPieceProps {
  grid: Cell[][]
}

function NextPiece({ grid }: NextPieceProps) {
  return (
    <div className="next-piece">
      <span className="next-piece-title">Siguiente</span>
      <div className="next-piece-grid">
        {grid.map((row, rowIndex) =>
          row.map((cell, colIndex) => (
            <div
              key={`${rowIndex}-${colIndex}`}
              className={`next-piece-cell${cell ? ` cell-${cell}` : ''}`}
            />
          )),
        )}
      </div>
    </div>
  )
}

export default NextPiece
