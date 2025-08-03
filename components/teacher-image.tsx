"use client"

import Image from "next/image"
import SpeechBubble from "@/components/speech-bubble" // Importação padrão

interface TeacherImageProps {
  speechText?: string
  showSpeechBubble?: boolean
  speechBubblePositionClasses?: string
  speechBubbleButtons?: {
    label: string
    onClick: () => void
    variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link"
  }[]
  onSpeechBubbleClose?: () => void
}

export default function TeacherImage({
  speechText,
  showSpeechBubble = false,
  speechBubblePositionClasses = "bottom-4 left-1/2 -translate-x-1/2",
  speechBubbleButtons,
  onSpeechBubbleClose,
}: TeacherImageProps) {
  return (
    <div className="relative">
      <Image src="/images/teacher.png" alt="Teacher" width={300} height={400} className="mx-auto" />
      {showSpeechBubble && speechText && (
        <div className="absolute bottom-20 left-1/2 -translate-x-1/2">
          <SpeechBubble
            text={speechText}
            positionClasses={speechBubblePositionClasses}
            buttons={speechBubbleButtons}
            onClose={onSpeechBubbleClose}
          />
        </div>
      )}
    </div>
  )
}
