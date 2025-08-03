"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Lock } from "lucide-react"
import BackButton from "@/components/back-button" // Importação padrão
import SpeechBubble from "@/components/speech-bubble" // Importação padrão
import { useI18n } from "@/i18n/use-i18n"

export default function TripPage() {
  const { t } = useI18n()
  const [showTeacherSpeechBubble, setShowTeacherSpeechBubble] = useState(true)
  const [isLocked, setIsLocked] = useState(true) // Estado para controlar o cadeado

  const teacherTripText = t("teacher_trip_text")
  const yesButtonLabel = t("yes_button_label")
  const noButtonLabel = t("no_button_label")

  const handleYesClick = () => {
    console.log("Yes clicked!")
    setShowTeacherSpeechBubble(false)
    // Implementar lógica para continuar a viagem ou desbloquear
  }

  const handleNoClick = () => {
    console.log("No clicked!")
    setShowTeacherSpeechBubble(false)
    // Implementar lógica para cancelar ou voltar
  }

  const handleSpeechBubbleClose = () => {
    setShowTeacherSpeechBubble(false)
  }

  // Simula a lógica de desbloqueio (ex: após uma ação do usuário ou condição do jogo)
  useEffect(() => {
    // Exemplo: desbloquear após 5 segundos
    // const timer = setTimeout(() => {
    //   setIsLocked(false);
    // }, 5000);
    // return () => clearTimeout(timer);
  }, [])

  return (
    <div
      className="relative flex h-screen w-full flex-col items-center justify-start overflow-hidden bg-cover bg-center p-4"
      style={{ backgroundImage: 'url("/images/map-background.png")' }}
    >
      <BackButton />

      {/* Overlay de bloqueio */}
      {isLocked && (
        <div className="absolute inset-0 z-40 flex items-center justify-center bg-black bg-opacity-50">
          <div className="relative flex flex-col items-center justify-center p-4">
            <Lock className="h-24 w-24 text-white animate-pulse" />
            <p className="mt-4 text-lg font-semibold text-white">{t("trip_locked_message")}</p>
          </div>
        </div>
      )}

      {/* Conteúdo da página de viagem */}
      <div className="relative z-10 flex h-full w-full flex-col items-center justify-between">
        {/* Imagem do professor e balão de fala */}
        <div className="relative flex w-full justify-center pt-16">
          <div className="relative z-20 flex flex-col items-center justify-center">
            <Image
              src="/images/teacher.png"
              alt="Teacher"
              width={300}
              height={300}
              className="cursor-pointer object-contain"
            />
            {showTeacherSpeechBubble && teacherTripText && (
              <SpeechBubble
                text={teacherTripText}
                buttons={[
                  { label: yesButtonLabel, onClick: handleYesClick },
                  { label: noButtonLabel, onClick: handleNoClick, variant: "destructive" },
                ]}
                onClose={handleSpeechBubbleClose}
                positionClasses="bottom-4 left-1/2 -translate-x-1/2 md:bottom-1/4"
              />
            )}
          </div>
        </div>

        {/* Imagem do monumento de Portugal */}
        <div className="relative z-0 mb-8 flex-grow flex items-center justify-center">
          <Image
            src="/images/portugal-monument.png"
            alt="Portugal Monument"
            width={500}
            height={300}
            className="object-contain"
          />
        </div>
      </div>
    </div>
  )
}
