import type { Board, CandyType, Coords } from "@/types/candy-crush"

const CANDY_TYPES: CandyType[] = ["cherry", "cashew", "pineapple", "kiwi", "strawberry"]
const BOARD_SIZE = 8

export function getRandomCandy(): CandyType {
  return CANDY_TYPES[Math.floor(Math.random() * CANDY_TYPES.length)]
}

export function generateBoard(rows: number, cols: number): Board {
  const board: Board = []
  for (let r = 0; r < rows; r++) {
    board[r] = []
    for (let c = 0; c < cols; c++) {
      let newCandy: CandyType
      do {
        newCandy = getRandomCandy()
      } while (
        (c >= 2 && board[r][c - 1] === newCandy && board[r][c - 2] === newCandy) ||
        (r >= 2 && board[r - 1][c] === newCandy && board[r - 2][c] === newCandy)
      )
      board[r][c] = newCandy
    }
  }
  return board
}

export function checkMatches(board: Board): Coords[] {
  const matches: Coords[] = []
  const rows = board.length
  const cols = board[0].length

  // Check horizontal matches
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols - 2; c++) {
      const candy = board[r][c]
      if (candy && board[r][c + 1] === candy && board[r][c + 2] === candy) {
        matches.push({ row: r, col: c }, { row: r, col: c + 1 }, { row: r, col: c + 2 })
        let k = 3
        while (c + k < cols && board[r][c + k] === candy) {
          matches.push({ row: r, col: c + k })
          k++
        }
      }
    }
  }

  // Check vertical matches
  for (let c = 0; c < cols; c++) {
    for (let r = 0; r < rows - 2; r++) {
      const candy = board[r][c]
      if (candy && board[r + 1][c] === candy && board[r + 2][c] === candy) {
        matches.push({ row: r, col: c }, { row: r + 1, col: c }, { row: r + 2, col: c })
        let k = 3
        while (r + k < rows && board[r + k][c] === candy) {
          matches.push({ row: r + k, col: c })
          k++
        }
      }
    }
  }

  // Remove duplicates
  const uniqueMatches = Array.from(new Set(matches.map((m) => `${m.row},${m.col}`))).map((s) => {
    const [row, col] = s.split(",").map(Number)
    return { row, col }
  })

  return uniqueMatches
}

export function clearMatches(board: Board, matches: Coords[]): Board {
  const newBoard = board.map((row) => [...row]) // Deep copy
  matches.forEach(({ row, col }) => {
    newBoard[row][col] = null // Mark as empty
  })
  return newBoard
}

export function applyGravity(board: Board): Board {
  const newBoard = board.map((row) => [...row])
  const rows = newBoard.length
  const cols = newBoard[0].length

  for (let c = 0; c < cols; c++) {
    const emptySpaces: Coords[] = []
    for (let r = rows - 1; r >= 0; r--) {
      if (newBoard[r][c] === null) {
        emptySpaces.push({ row: r, col: c })
      } else if (emptySpaces.length > 0) {
        const targetRow = emptySpaces.shift()!.row
        newBoard[targetRow][c] = newBoard[r][c]
        newBoard[r][c] = null
        emptySpaces.push({ row: r, col: c }) // The old position is now empty
      }
    }
  }
  return newBoard
}

export function fillEmptySpaces(board: Board): Board {
  const newBoard = board.map((row) => [...row])
  const rows = newBoard.length
  const cols = newBoard[0].length

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (newBoard[r][c] === null) {
        newBoard[r][c] = getRandomCandy()
      }
    }
  }
  return newBoard
}
