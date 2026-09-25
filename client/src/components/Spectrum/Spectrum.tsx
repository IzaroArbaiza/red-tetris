import { BOARD_COLS, BOARD_ROWS, type OpponentSpectrum } from '../../types/tetris'
import '../../styles/spectrum.scss'

interface SpectrumProps {
  opponent: OpponentSpectrum
}

function Spectrum({ opponent }: SpectrumProps) {
  const { playerName, isHost, isEliminated, columnHeights } = opponent

  return (
    <div className={`spectrum${isEliminated ? ' spectrum-eliminated' : ''}`}>
      <div className="spectrum-header">
        <span className="spectrum-name">{playerName}</span>
        {isHost && <span className="spectrum-badge">Host</span>}
        {isEliminated && <span className="spectrum-badge spectrum-badge-out">Eliminado</span>}
      </div>
      <div
        className="spectrum-board"
        style={{ gridTemplateColumns: `repeat(${BOARD_COLS}, 1fr)`, gridTemplateRows: `repeat(${BOARD_ROWS}, 1fr)` }}
      >
        {Array.from({ length: BOARD_ROWS }, (_, rowIndex) =>
          columnHeights.map((height, colIndex) => {
            const isFilled = rowIndex >= BOARD_ROWS - height
            return (
              <div
                key={`${rowIndex}-${colIndex}`}
                className={`spectrum-cell${isFilled ? ' spectrum-cell-filled' : ''}`}
              />
            )
          }),
        )}
      </div>
    </div>
  )
}

export default Spectrum
