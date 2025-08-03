"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ChevronLeft } from "lucide-react"
import { useCandyCrushGame } from "@/hooks/use-candy-crush-game"
import { useXP } from "@/hooks/use-xp"
import CandyCrushBoard from "@/components/candy-crush-board"
import { useState, useCallback } from "react"
import { useI18n } from "@/i18n/use-i18n" // Import useI18n

export default function CandyCrushPage() {
  const router = useRouter()
  const { addXP } = useXP()
  const { t } = useI18n() // Use the i18n hook

  const [xpMessage, setXpMessage] = useState("")
  const [showXpMessage, setShowXpMessage] = useState(false)

  const handleXpGainDisplay = useCallback((amount: number) => {
    setXpMessage(`+${amount.toFixed(2)} XP`)
    setShowXpMessage(true)
    setTimeout(() => {
      setShowXpMessage(false)
      setXpMessage("") // Clear message after animation
    }, 1500) // Message visible for 1.5 seconds
  }, [])

  const { board, handleCandyClick, selectedCandy } = useCandyCrushGame(addXP, handleXpGainDisplay)

  return (
    <div
      className="relative flex h-screen overflow-hidden flex-col items-center justify-center p-4 text-white"
      style={{
        backgroundImage: 'url("/images/map-background.png")', // Keeps map background
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <Button
        variant="ghost"
        onClick={() => router.back()}
        className="absolute top-4 left-4 text-white bg-black hover:bg-gray-800" // Added black background for visibility
      >
        <ChevronLeft className="h-6 w-6" />
        {t("back")} {/* Translated "Back" */}
      </Button>
      {/* XP Gain Message */}
      <div
        className={`absolute text-green-400 text-sm font-bold transition-all duration-500 ease-out z-30
        ${showXpMessage ? "opacity-100 -translate-y-4" : "opacity-0 translate-y-0"}
      `}
        style={{ top: "calc(50% - 100px)" }} // Position above the board
      >
        {xpMessage}
      </div>
      <CandyCrushBoard board={board} onCandyClick={handleCandyClick} selectedCandy={selectedCandy} />
      <p className="mt-8 text-lg text-white/80">{t("candy_crush_instructions")}</p> {/* Translated instructions */}
    </div>
  )
}
