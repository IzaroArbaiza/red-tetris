import { BOARD_COLS, BOARD_ROWS, type BoardGrid, type Cell } from '../types/tetris'

export const createEmptyBoard = (): BoardGrid =>
  Array.from({ length: BOARD_ROWS }, () => Array<Cell>(BOARD_COLS).fill(null))
