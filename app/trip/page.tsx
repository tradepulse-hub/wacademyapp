"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Lock } from "lucide-react"
import { useI18n } from "@/i18n/use-i18n"
import BackButton from "@/components/back-button" // Corrected import
import SpeechBubble from "@/components/speech-bubble"

export default function TripPage() {
  const { t } = useI18n()
  const [showTeacherSpeech, setShowTeacherSpeech] = useState(true)
  const [showButtons, setShowButtons] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowButtons(true)
    }, 3000) // Show buttons after 3 seconds
    return () => clearTimeout(timer)
  }, [])

  const handleYesClick = () => {
    console.log("Yes clicked!")
    setShowTeacherSpeech(false)
  }

  const handleNoClick = () => {
    console.log("No clicked!")
    setShowTeacherSpeech(false)
  }

  const teacherTripText = t("teacher_trip_text")
  const yesButtonLabel = t("yes_button")
  const noButtonLabel = t("no_button")

  return (
    <div
      className="relative flex min-h-screen items-center justify-center overflow-hidden bg-cover bg-center"
      style={{ backgroundImage: `url('/images/map-background.png')` }}
    >
      <BackButton href="/agenda" className="absolute top-4 left-4 z-50" />
      <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 z-40">
        <Lock className="h-24 w-24 text-white" />
      </div>
      <div className="relative z-50">
        <Image src="/images/teacher.png" alt="Teacher" width={300} height={400} className="mx-auto" />
        {showTeacherSpeech && (
          <div className="absolute bottom-20 left-1/2 -translate-x-1/2">
            <SpeechBubble
              text={teacherTripText}
              positionClasses="bottom-full left-1/2 -translate-x-1/2 mb-2"
              buttons={
                showButtons
                  ? [
                      { label: yesButtonLabel, onClick: handleYesClick },
                      { label: noButtonLabel, onClick: handleNoClick, variant: "destructive" },
                    ]
                  : []
              }
              onClose={() => setShowTeacherSpeech(false)}
            />
          </div>
        )}
      </div>
    </div>
  )
}
