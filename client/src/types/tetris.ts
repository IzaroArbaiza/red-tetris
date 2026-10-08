export type TetrominoColor = 'cyan' | 'blue' | 'orange' | 'yellow' | 'green' | 'purple' | 'red'
export type Cell = TetrominoColor | null
export type BoardGrid = Cell[][]

export const BOARD_COLS = 10
export const BOARD_ROWS = 20

export interface OpponentSpectrum {
  playerName: string
  isHost: boolean
  isEliminated: boolean
  columnHeights: number[]
}

export type PieceType = 'I' | 'O' | 'T' | 'J' | 'L' | 'S' | 'Z'

export interface PieceData {
  type: PieceType
  shape: number[][]
  color: TetrominoColor
}

export interface ActivePiece {
  piece: PieceData
  row: number
  col: number
}
