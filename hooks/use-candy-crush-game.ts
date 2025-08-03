"use client"

import { useState, useEffect, useCallback } from "react"
import type { Board, Coords } from "@/types/candy-crush"
import { generateBoard, checkMatches, clearMatches, applyGravity, fillEmptySpaces } from "@/lib/candy-crush-utils"

const BOARD_SIZE = 8

export function useCandyCrushGame(addXP: (amount: number) => void, onXpGainDisplay: (amount: number) => void) {
  const [board, setBoard] = useState<Board>(() => generateBoard(BOARD_SIZE, BOARD_SIZE))
  const [selectedCandy, setSelectedCandy] = useState<Coords | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)

  const processBoard = useCallback(
    (currentBoard: Board) => {
      let newBoard = currentBoard
      let matchesFound = true

      while (matchesFound) {
        const matches = checkMatches(newBoard)
        if (matches.length > 0) {
          newBoard = clearMatches(newBoard, matches)
          newBoard = applyGravity(newBoard)
          newBoard = fillEmptySpaces(newBoard)
          setBoard(newBoard) // Update board to show changes
          const xpAmount = matches.length * 0.01
          addXP(xpAmount) // Add XP for each match found
          onXpGainDisplay(xpAmount) // Display XP gain message

          // Give a small delay for visual effect before checking again
          // This is a simplified approach, in a real game you'd use requestAnimationFrame
          matchesFound = true // Keep looping if matches were found
        } else {
          matchesFound = false
        }
      }
      setIsProcessing(false)
    },
    [addXP, onXpGainDisplay],
  )

  useEffect(() => {
    // Initial check for matches on load
    setIsProcessing(true)
    processBoard(board)
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const handleCandyClick = useCallback(
    (row: number, col: number) => {
      if (isProcessing) return

      if (selectedCandy) {
        const isAdjacent =
          (Math.abs(selectedCandy.row - row) === 1 && selectedCandy.col === col) ||
          (Math.abs(selectedCandy.col - col) === 1 && selectedCandy.row === row)

        if (isAdjacent) {
          setIsProcessing(true)
          const newBoard = board.map((r) => [...r])
          // Swap candies
          ;[newBoard[selectedCandy.row][selectedCandy.col], newBoard[row][col]] = [
            newBoard[row][col],
            newBoard[selectedCandy.row][selectedCandy.col],
          ]

          setBoard(newBoard)
          setSelectedCandy(null)

          // Check for matches after swap
          const matchesAfterSwap = checkMatches(newBoard)
          if (matchesAfterSwap.length > 0) {
            processBoard(newBoard)
          } else {
            // If no match, swap back
            setTimeout(() => {
              ;[newBoard[selectedCandy.row][selectedCandy.col], newBoard[row][col]] = [
                newBoard[row][col],
                newBoard[selectedCandy.row][selectedCandy.col],
              ]
              setBoard(newBoard)
              setIsProcessing(false)
            }, 300) // Small delay before swapping back
          }
        } else {
          setSelectedCandy({ row, col })
        }
      } else {
        setSelectedCandy({ row, col })
      }
    },
    [board, selectedCandy, isProcessing, processBoard],
  )

  return { board, handleCandyClick, selectedCandy }
}
