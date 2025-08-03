"use client"
import { useState, useEffect, useCallback, useMemo } from "react"
import { Calendar } from "@/components/ui/calendar"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { Plane, User, Loader2 } from "lucide-react" // Importar Loader2
import { useXP } from "@/hooks/use-xp"
import TeacherImage from "@/components/teacher-image"
import SpeechBubble from "@/components/speech-bubble"
import UserProfileModal from "@/components/user-profile-modal"
import { useI18n } from "@/i18n/use-i18n"
import { useAuth } from "@/hooks/use-auth"
import { airdropStatus as useAirDropStatus } from "@/hooks/use-airdrop-status" // Importar airdropStatus

// Importar o conteúdo de cada disciplina
import { mathematicsContent } from "@/content/disciplines/mathematics-content"
import { memoryContent } from "@/content/disciplines/memory-content"
import { financeContent } from "@/content/disciplines/finance-content"
import { historyContent } from "@/content/disciplines/history-content"
import { geographyContent } from "@/content/disciplines/geography-content"
import { scienceContent } from "@/content/disciplines/science-content"
import { artsContent } from "@/content/disciplines/arts-content"
import { literatureContent } from "@/content/disciplines/literature-content"
import type { ContentItem } from "@/content/disciplines/types"

// Mapeamento de todos os conteúdos das disciplinas
const allDisciplineContent: Record<string, ContentItem[]> = {
  mathematics: mathematicsContent,
  memory: memoryContent,
  finance: financeContent,
  history: historyContent,
  geography: geographyContent,
  science: scienceContent,
  arts: artsContent,
  literature: literatureContent,
  // Adicione outras disciplinas aqui se criar novos arquivos de conteúdo
}

// Versão da lógica de disciplinas diárias. Incremente para forçar uma nova geração.
const DAILY_DISCIPLINES_VERSION = 2

export default function AgendaPage() {
  const [date, setDate] = useState<Date | undefined>(new Date())
  const [showTripSpeech, setShowTripSpeech] = useState(false)
  const [showDailyDisciplinesSpeech, setShowDailyDisciplinesSpeech] = useState(false)
  const [showWelcomeAgendaSpeech, setShowWelcomeAgendaSpeech] = useState(true)
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false)
  const [dailyDisciplinesForSelectedDate, setDailyDisciplinesForSelectedDate] = useState<string[]>([])
  const [speechTextForSelectedDate, setSpeechTextForSelectedDate] = useState("")
  const router = useRouter()
  const { t, locale } = useI18n()

  const { level, xpPercentage, canClaimLevelUp, claimLevelUp, isClaimingAirdrop } = useXP()
  const { userName, isAuthenticated, walletAddress } = useAuth() // Obtenha o userName e estado da carteira
  const { airdropStatus } = useAirDropStatus() // Importar airdropStatus

  // Filtra as disciplinas que têm 10 ou mais exercícios e memoiza o resultado
  const availableDisciplines = useMemo(() => {
    return Object.keys(allDisciplineContent)
      .filter((slug) => allDisciplineContent[slug].length >= 10)
      .map((slug) => slug.charAt(0).toUpperCase() + slug.slice(1))
  }, [])

  // Função para formatar a data para a chave do localStorage
  const formatDateKey = (d: Date) => d.toISOString().slice(0, 10)

  // Função para gerar e armazenar disciplinas diárias
  const generateAndStoreDailyDisciplines = useCallback(() => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    // Usando a chave versionada para o localStorage
    const todayKey = `worldAcademyDailyDisciplines_v${DAILY_DISCIPLINES_VERSION}_${formatDateKey(today)}`
    const storedDisciplines = localStorage.getItem(todayKey)

    let disciplinesToUse: string[]
    if (storedDisciplines) {
      disciplinesToUse = JSON.parse(storedDisciplines)
    } else {
      const shuffled = [...availableDisciplines].sort(() => 0.5 - Math.random())
      // Alterado para selecionar apenas 2 disciplinas
      disciplinesToUse = shuffled.slice(0, 2)
      localStorage.setItem(todayKey, JSON.stringify(disciplinesToUse))
    }
    setDailyDisciplinesForSelectedDate(disciplinesToUse)
    setSpeechTextForSelectedDate(t("disciplines_for_date", { date: today.toLocaleDateString(locale) }))
  }, [availableDisciplines, t, locale])

  // Mensagem inicial do professor para a agenda
  const initialAgendaWelcomeText = t("welcome_teacher_text")

  // Efeito para carregar as disciplinas do dia atual ao montar
  useEffect(() => {
    generateAndStoreDailyDisciplines()
    setShowWelcomeAgendaSpeech(true)
  }, [generateAndStoreDailyDisciplines])

  const teacherTripText = t("teacher_trip_text")

  const handlePayTrip = () => {
    router.push("/trip")
    setShowTripSpeech(false)
  }

  const handleDeclineTrip = () => {
    setShowTripSpeech(false)
  }

  const handleDateSelect = (selectedDate: Date | undefined) => {
    if (!selectedDate) {
      setShowDailyDisciplinesSpeech(false)
      return
    }

    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const selectedDay = new Date(selectedDate)
    selectedDay.setHours(0, 0, 0, 0)

    setShowTripSpeech(false)
    setShowWelcomeAgendaSpeech(false)

    if (selectedDay.getTime() === today.getTime()) {
      // Usando a chave versionada para o localStorage
      const todayKey = `worldAcademyDailyDisciplines_v${DAILY_DISCIPLINES_VERSION}_${formatDateKey(today)}`
      const storedDisciplines = localStorage.getItem(todayKey)
      const disciplinesToUse = storedDisciplines ? JSON.parse(storedDisciplines) : []

      setDailyDisciplinesForSelectedDate(disciplinesToUse)
      setSpeechTextForSelectedDate(t("disciplines_for_date", { date: selectedDate.toLocaleDateString(locale) }))
      setShowDailyDisciplinesSpeech(true)
    } else {
      setDailyDisciplinesForSelectedDate([])
      setSpeechTextForSelectedDate(t("no_disciplines_available", { date: selectedDate.toLocaleDateString(locale) }))
      setShowDailyDisciplinesSpeech(true)
    }
    setDate(selectedDate)
  }

  return (
    <div
      className="flex h-screen overflow-hidden flex-col items-center justify-start pt-0 px-4"
      style={{
        backgroundImage: 'url("/images/books-background.png")',
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
      }}
    >
      {/* Title Banner */}
      <div
        className="relative flex items-center justify-center w-full max-w-xl h-32 mt-0"
        style={{
          backgroundImage: 'url("/images/logoplace.png")',
          backgroundSize: "contain",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "center",
        }}
      >
        <Image
          src="/images/logowacademyrb.png"
          alt="WAcademy Logo"
          width={75}
          height={75}
          className="z-10 object-contain"
        />
      </div>

      {/* XP Bar */}
      <div className="absolute top-[21%] left-1/2 -translate-x-1/2 w-[40%] max-w-md bg-gray-800 rounded-full h-6 flex items-center justify-between px-2 z-10">
        <span className="text-white text-sm font-semibold">
          {t("level")} {level}
        </span>
        <div className="flex-grow mx-2 bg-gray-600 rounded-full h-4 relative">
          <div
            className="bg-yellow-400 h-full rounded-full transition-all duration-300"
            style={{ width: `${Math.min(xpPercentage, 100)}%` }}
          ></div>
        </div>
        <span className="text-white text-sm">{xpPercentage.toFixed(2)}%</span>
      </div>

      {/* Claim Level Up Button (Airdrop) */}
      {canClaimLevelUp && (
        <Button
          onClick={claimLevelUp}
          className="absolute top-[21%] mt-8 left-1/2 -translate-x-1/2 bg-white text-black border border-black shadow-lg animate-pulse-glow z-20"
          disabled={isClaimingAirdrop || !isAuthenticated || !walletAddress || !airdropStatus?.canClaim}
        >
          {isClaimingAirdrop ? (
            <span className="flex items-center">
              <Loader2 className="mr-2 h-4 w-4 animate-spin" /> {t("claiming")}
            </span>
          ) : (
            t("claim_level_up")
          )}
        </Button>
      )}
      {/* Mensagem de status do airdrop */}
      {airdropStatus && !airdropStatus.canClaim && (
        <div className="absolute top-[21%] mt-16 left-1/2 -translate-x-1/2 text-red-600 text-xs text-center z-20">
          {airdropStatus.isBlocked
            ? t("airdrop_blocked_message")
            : airdropStatus.claimsToday >= airdropStatus.maxDailyClaims
              ? t("airdrop_daily_limit_reached", { count: airdropStatus.maxDailyClaims })
              : ""}
        </div>
      )}

      {/* Agenda Board and Calendar */}
      <div
        className="relative z-1 flex flex-col items-center justify-center p-72 mt-[-100px]"
        style={{
          backgroundImage: 'url("/images/agendatable.png")',
          backgroundSize: "contain",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "center",
          width: "100%",
          maxWidth: "1400px",
          aspectRatio: "1.2 / 1",
        }}
      >
        <Calendar
          mode="single"
          selected={date}
          onSelect={(newDate) => {
            setDate(newDate)
            handleDateSelect(newDate)
          }}
          className="rounded-md border shadow-lg backdrop-blur-sm bg-transparent text-xs"
          initialFocus
        />
      </div>

      {/* User Profile Button (now above Plane button) */}
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setIsProfileModalOpen(true)}
        className="absolute bottom-80 right-4 z-20 h-10 w-10 rounded-full bg-white border border-black text-black shadow-lg hover:bg-gray-100 transition-all duration-200"
        aria-label={t("user_profile")}
      >
        <User className="h-6 w-6" />
      </Button>

      {/* Plane Button to trigger teacher/speech bubble */}
      <Button
        variant="ghost"
        size="icon"
        onClick={() => {
          setShowTripSpeech(true)
          setShowDailyDisciplinesSpeech(false)
          setShowWelcomeAgendaSpeech(false)
        }}
        className="absolute bottom-64 right-4 z-20 h-10 w-10 rounded-full bg-white border border-black text-black shadow-lg hover:bg-gray-100 transition-all duration-200"
        aria-label={t("study_visit")}
      >
        <Plane className="h-6 w-6" />
      </Button>

      {/* Teacher Image and Speech Bubble - Conditionally rendered based on context */}
      {(showTripSpeech || showDailyDisciplinesSpeech || showWelcomeAgendaSpeech) && (
        <>
          <TeacherImage />
          {showWelcomeAgendaSpeech && (
            <SpeechBubble
              text={initialAgendaWelcomeText}
              buttons={[{ label: t("got_it"), onClick: () => setShowWelcomeAgendaSpeech(false), variant: "default" }]}
              onClose={() => setShowWelcomeAgendaSpeech(false)}
              positionClasses="bottom-4 left-28 md:left-32"
            />
          )}
          {!showWelcomeAgendaSpeech && showTripSpeech && (
            <SpeechBubble
              text={teacherTripText}
              buttons={[
                { label: t("travel_wld"), onClick: handlePayTrip, variant: "default" },
                { label: t("no_dont_want_to_go"), onClick: handleDeclineTrip, variant: "destructive" },
              ]}
              onClose={() => setShowTripSpeech(false)}
              positionClasses="bottom-4 left-28 md:left-32"
            />
          )}
          {!showWelcomeAgendaSpeech && showDailyDisciplinesSpeech && (
            <SpeechBubble
              text={speechTextForSelectedDate}
              buttons={
                dailyDisciplinesForSelectedDate.length > 0
                  ? dailyDisciplinesForSelectedDate.map((discipline) => ({
                      label: discipline,
                      onClick: () => {
                        router.push(`/disciplines/${discipline.toLowerCase().replace(/\s/g, "-")}`)
                        setShowDailyDisciplinesSpeech(false)
                      },
                      variant: "default",
                    }))
                  : []
              }
              onClose={() => setShowDailyDisciplinesSpeech(false)}
              positionClasses="bottom-4 left-28 md:left-32"
            />
          )}
        </>
      )}

      {/* User Profile Modal */}
      <UserProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        userName={userName}
        level={level}
        xpPercentage={xpPercentage}
      />
    </div>
  )
}
