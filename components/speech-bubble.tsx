"use client"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface SpeechBubbleProps {
  text: string
  positionClasses?: string
  buttons?: {
    label: string
    onClick: () => void
    variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link"
  }[]
  onClose?: () => void
}

export default function SpeechBubble({ text, positionClasses, buttons, onClose }: SpeechBubbleProps) {
  return (
    <div className={cn("relative max-w-xs rounded-lg bg-white p-4 text-gray-800 shadow-lg", positionClasses)}>
      <p className="text-sm">{text}</p>
      {buttons && buttons.length > 0 && (
        <div className="mt-4 flex justify-end gap-2">
          {buttons.map((button, index) => (
            <Button key={index} onClick={button.onClick} variant={button.variant || "default"} size="sm">
              {button.label}
            </Button>
          ))}
        </div>
      )}
      {onClose && (
        <Button
          variant="ghost"
          size="sm"
          onClick={onClose}
          className="absolute top-1 right-1 h-6 w-6 p-0 text-gray-500 hover:bg-gray-100"
          aria-label="Close"
        >
          &times;
        </Button>
      )}
    </div>
  )
}
