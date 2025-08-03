"use client"

import { useState, useEffect } from "react"
import { CardDescription } from "@/components/ui/card"
import { CardContent } from "@/components/ui/card"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

interface SpeechBubbleProps {
  text: string
  delay?: number
  buttons?: {
    label: string
    onClick: () => void
    variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link"
  }[]
  onClose?: () => void
  positionClasses?: string // Nova prop para controlar o posicionamento
}

const SpeechBubble = ({
  text,
  delay = 50,
  buttons,
  onClose,
  positionClasses = "bottom-4 left-1/4", // Valor padrão, será sobrescrito
}: SpeechBubbleProps) => {
  const [displayedText, setDisplayedText] = useState("")
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isTextFullyDisplayed, setIsTextFullyDisplayed] = useState(false)

  // Efeito para resetar e iniciar a digitação quando a prop 'text' muda
  useEffect(() => {
    setDisplayedText("") // Reseta o texto exibido
    setCurrentIndex(0) // Reseta o índice
    setIsTextFullyDisplayed(false) // Reseta a flag de texto completo
  }, [text]) // Este efeito roda APENAS quando a prop 'text' muda

  // Efeito para lidar com a animação de digitação
  useEffect(() => {
    if (currentIndex < text.length) {
      const timeout = setTimeout(() => {
        setDisplayedText((prev) => prev + text[currentIndex])
        setCurrentIndex((prev) => prev + 1)
      }, delay)
      return () => clearTimeout(timeout)
    } else {
      setIsTextFullyDisplayed(true)
    }
  }, [currentIndex, delay, text]) // Este efeito continua a digitação

  return (
    <Card
      className={`absolute z-50 mt-2 w-full max-w-[250px] text-left shadow-lg md:mt-0 md:w-auto bg-white ${positionClasses}`}
    >
      <CardContent className="p-1 flex flex-col gap-2">
        <CardDescription className="text-[0.65rem] text-gray-900 whitespace-pre-wrap">{displayedText}</CardDescription>
        {isTextFullyDisplayed && (
          <>
            {buttons &&
              buttons.map((btn, index) => (
                <Button
                  key={index}
                  onClick={btn.onClick}
                  className={`text-xs py-1 h-auto ${btn.variant === "destructive" ? "bg-red-600 hover:bg-red-700" : "bg-blue-600 hover:bg-blue-700"} text-white`}
                  variant={btn.variant || "default"}
                >
                  {btn.label}
                </Button>
              ))}
            {onClose && (
              <Button onClick={onClose} className="bg-gray-400 hover:bg-gray-500 text-white text-xs py-1 h-auto mt-1">
                Close
              </Button>
            )}
          </>
        )}
      </CardContent>
    </Card>
  )
}

export default SpeechBubble
