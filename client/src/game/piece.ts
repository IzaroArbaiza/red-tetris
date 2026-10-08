import { BOARD_COLS, type ActivePiece, type BoardGrid, type Cell, type PieceData } from '../types/tetris'

const PREVIEW_SIZE = 4

//crea una preview de un grid 4x4 vacio
export const createEmptyPreview = (): Cell[][] =>
  Array.from({ length: PREVIEW_SIZE }, () => Array<Cell>(PREVIEW_SIZE).fill(null))

// crea la siguiente pieza en el panel de "siguiente pieza" 
export const pieceToPreview = (piece: PieceData | undefined): Cell[][] => {
  const grid = createEmptyPreview()
  if (!piece) return grid

  const rows = piece.shape.filter((row) => row.some(Boolean))
  const usedCols = piece.shape[0]
    .map((_, col) => col)
    .filter((col) => rows.some((row) => row[col]))
  const firstCol = usedCols[0] ?? 0
  const width = usedCols.length

  const rowOffset = Math.floor((PREVIEW_SIZE - rows.length) / 2)
  const colOffset = Math.floor((PREVIEW_SIZE - width) / 2)

  rows.forEach((row, rowIndex) => {
    for (let col = 0; col < width; col++) {
      if (row[firstCol + col]) grid[rowOffset + rowIndex][colOffset + col] = piece.color
    }
  })
  return grid
}

// centra la pieza y en board
export const spawnPiece = (piece: PieceData): ActivePiece => {
  const firstFilledRow = piece.shape.findIndex((row) => row.some(Boolean))
  return {
    piece,
    row: -Math.max(firstFilledRow, 0),
    col: Math.floor((BOARD_COLS - piece.shape[0].length) / 2),
  }
}

// crea una copia del tablero donde pinta la pieza pra jugar con ella
// asi evitamos pintar y borrar el tablero. cuando la pieza toca el fondo
// habra que fijar la pieza al fondo con un setBoard(mergePiece(board, activePiece))
export const mergePiece = (board: BoardGrid, active: ActivePiece | null): BoardGrid => {
  const grid = board.map((row) => [...row])
  if (!active) return grid

  active.piece.shape.forEach((shapeRow, r) => {
    shapeRow.forEach((filled, c) => {
      const row = active.row + r
      const col = active.col + c
      if (filled && grid[row]?.[col] !== undefined) grid[row][col] = active.piece.color
    })
  })
  return grid
}
