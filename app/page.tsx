"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import TeacherImage from "@/components/teacher-image"
import SpeechBubble from "@/components/speech-bubble"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useI18n } from "@/i18n/use-i18n"
import { MiniKit, type VerifyCommandInput, VerificationLevel, type ISuccessResult } from "@worldcoin/minikit-js" // Import MiniKit

export default function WorldAcademyWelcome() {
  const [userNameInput, setUserNameInput] = useState("") // Usar um estado separado para o input
  const [selectedLanguage, setSelectedLanguage] = useState("en")
  const [isVerifying, setIsVerifying] = useState(false) // Usar um estado separado para a verificação
  const router = useRouter()
  const { t, setLocale } = useI18n()

  const teacherText = t("invitation_teacher_text")

  useEffect(() => {
    // Verifica se o convite já foi visto no localStorage
    const hasSeenInvitation = localStorage.getItem("worldAcademyInvitationSeen")
    if (hasSeenInvitation === "true") {
      router.replace("/agenda") // Redireciona para a agenda se já viu o convite
    }
  }, [router])

  const handlePresentWorldID = async () => {
    if (!userNameInput) return // Garante que o nome foi inserido

    localStorage.setItem("worldAcademyUserName", userNameInput) // Salva o nome do usuário

    if (!MiniKit.isInstalled()) {
      console.error("World App (MiniKit) is not installed.")
      // Você pode adicionar um fallback ou mensagem para o usuário aqui
      localStorage.setItem("worldAcademyInvitationSeen", "true") // Marca como visto mesmo sem verificação
      router.push("/agenda") // Navega mesmo sem verificação se o app não estiver instalado
      return
    }

    setIsVerifying(true) // Inicia o estado de carregamento

    const verifyPayload: VerifyCommandInput = {
      action: "welcomewacademy", // O ID da ação do Developer Portal
      signal: userNameInput, // Opcional: pode ser o nome do usuário ou outro dado relevante
      verification_level: VerificationLevel.Orb, // Orb ou Device
    }

    try {
      const { finalPayload } = await MiniKit.commandsAsync.verify(verifyPayload)

      if (finalPayload.status === "error") {
        console.error("World ID verification error:", finalPayload)
        // Não retorna aqui, continua para a navegação
      } else {
        // Enviar a prova para o backend para verificação
        const verifyResponse = await fetch("/api/verify", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            payload: finalPayload as ISuccessResult,
            action: "welcomewacademy",
            signal: userNameInput,
          }),
        })

        const verifyResponseJson = await verifyResponse.json()

        if (verifyResponse.ok && verifyResponseJson.status === 200) {
          console.log("World ID verification success on backend!")
        } else {
          console.error("Backend verification failed (but proceeding):", verifyResponseJson)
        }
      }
      localStorage.setItem("worldAcademyInvitationSeen", "true") // Marca como visto após a tentativa de verificação
      // Navega para a agenda independentemente do resultado da verificação do backend
      router.push("/agenda")
    } catch (error) {
      console.error("Error during World ID process or backend call (but proceeding):", error)
      localStorage.setItem("worldAcademyInvitationSeen", "true") // Marca como visto mesmo em caso de erro
      router.push("/agenda") // Garante navegação mesmo em caso de erro na chamada fetch
    } finally {
      setIsVerifying(false) // Finaliza o estado de carregamento
    }
  }

  return (
    <div
      className="relative flex h-screen overflow-hidden flex-col items-center justify-start p-4 text-gray-900 dark:text-gray-50"
      style={{
        backgroundImage: 'url("/images/inviteacademy.jpg")',
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Invitation Content */}
      <div className="mt-16 flex w-full max-w-md flex-col items-center space-y-6 text-center">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-50">{t("special_invitation_title")}</h1>
        <p className="text-base text-gray-800 dark:text-gray-200">{t("invitation_description")}</p>
        <div className="w-full space-y-4">
          <Label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            {t("your_name_label")}
          </Label>
          <Input
            id="name"
            placeholder={t("enter_your_name_placeholder")}
            value={userNameInput}
            onChange={(e) => setUserNameInput(e.target.value)}
            className="w-full h-10 text-base text-center bg-white/80 border-yellow-400 text-gray-900 placeholder:text-gray-500"
          />

          <Label htmlFor="language" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mt-4">
            {t("preferred_language_label")}
          </Label>
          <Select
            onValueChange={(value) => {
              setSelectedLanguage(value)
              setLocale(value)
            }}
            defaultValue={selectedLanguage}
          >
            <SelectTrigger className="w-full h-10 text-base bg-white/80 border-yellow-400 text-gray-900">
              <SelectValue placeholder={t("select_a_language_placeholder")} />
            </SelectTrigger>
            <SelectContent className="bg-white text-gray-900">
              <SelectItem value="en">English</SelectItem>
              <SelectItem value="es">Spanish</SelectItem>
              <SelectItem value="id">Indonesian</SelectItem>
              <SelectItem value="ja">Japanese</SelectItem>
            </SelectContent>
          </Select>

          <Button
            className="w-full py-2 text-base font-semibold bg-yellow-600 hover:bg-yellow-700 text-white"
            disabled={!userNameInput || isVerifying}
            onClick={handlePresentWorldID}
          >
            {isVerifying ? "Verifying World ID..." : t("present_world_id_button")}
          </Button>
        </div>
      </div>
      {/* Teacher Image in the bottom left corner */}
      <TeacherImage />
      {/* Teacher's Speech Bubble (more to the right) */}
      <SpeechBubble text={teacherText} positionClasses="bottom-4 left-28 md:left-32" />
    </div>
  )
}
