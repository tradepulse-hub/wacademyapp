"use client"

import type { Board, CandyType, Coords } from "@/types/candy-crush"
import { cn } from "@/lib/utils"
import Image from "next/image"

interface CandyCrushBoardProps {
  board: Board
  onCandyClick: (row: number, col: number) => void
  selectedCandy: Coords | null
}

const fruitImages: Record<CandyType, string> = {
  cherry: "/images/cereja.png",
  cashew: "/images/caju.png",
  pineapple: "/images/ananas.png",
  kiwi: "/images/kiwi.png",
  strawberry: "/images/morango.png",
}

export default function CandyCrushBoard({ board, onCandyClick, selectedCandy }: CandyCrushBoardProps) {
  return (
    <div className="grid grid-cols-8 gap-1 p-2 border-4 border-gray-700 rounded-lg bg-gray-800 shadow-xl">
      {board.map((row, rowIndex) =>
        row.map((candy, colIndex) => (
          <div
            key={`${rowIndex}-${colIndex}`}
            className={cn(
              "relative w-10 h-10 rounded-md cursor-pointer transition-all duration-100 flex items-center justify-center",
              candy === null ? "bg-gray-600 opacity-0" : "bg-gray-700", // Fundo para o slot, invisível se vazio
              selectedCandy?.row === rowIndex &&
                selectedCandy?.col === colIndex &&
                "ring-4 ring-white ring-offset-2 ring-offset-gray-800",
            )}
            onClick={() => onCandyClick(rowIndex, colIndex)}
          >
            {candy && (
              <Image
                src={fruitImages[candy] || "/placeholder.svg"}
                alt={candy}
                layout="fill"
                objectFit="contain"
                className="p-1" // Adiciona um pequeno padding para a imagem não tocar as bordas
              />
            )}
          </div>
        )),
      )}
    </div>
  )
}
