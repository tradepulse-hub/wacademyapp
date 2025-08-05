"use client"

import Image from "next/image"
import { useRouter } from "next/navigation"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useXP } from "@/hooks/use-xp"
import { cn } from "@/lib/utils"
import BackButton from "@/components/back-button"
import { useI18n } from "@/i18n/use-i18n"
import TeacherImage from "@/components/teacher-image"
import SpeechBubble from "@/components/speech-bubble"
import { Lightbulb } from "lucide-react"

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

// Mapeamento dos slugs para o conteúdo importado
const disciplineContent: Record<string, ContentItem[]> = {
  mathematics: mathematicsContent,
  memory: memoryContent,
  finance: financeContent,
  history: historyContent,
  geography: geographyContent,
  science: scienceContent,
  arts: artsContent,
  literature: literatureContent,
}

// Fisher-Yates shuffle algorithm
function shuffleArray<T>(array: T[]): T[] {
  const newArray = [...array]
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[newArray[i], newArray[j]] = [newArray[j], newArray[i]]
  }
  return newArray
}

export default function DisciplinePage({ params }: { params: { slug: string } }) {
  const router = useRouter()
  const disciplineSlug = params.slug
  const disciplineName = decodeURIComponent(disciplineSlug).replace(/-/g, " ")
  const originalContent = disciplineContent[disciplineSlug] || []
  const { t } = useI18n()

  const { addXP } = useXP()

  const [shuffledContent, setShuffledContent] = useState<ContentItem[]>([])
  const [currentContentIndex, setCurrentContentIndex] = useState(0)
  const [userAnswer, setUserAnswer] = useState("")
  const [feedbackMessage, setFeedbackMessage] = useState("")
  const [isAnswerCorrect, setIsAnswerCorrect] = useState(false)
  const [hasAnswered, setHasAnswered] = useState(false)

  // State for teacher speech bubble
  const [showTeacherBubble, setShowTeacherBubble] = useState(true)
  const [teacherMessage, setTeacherMessage] = useState("")

  // State for tip message
  const [currentTipMessage, setCurrentTipMessage] = useState<string | null>(null)
  const [tipTimeoutId, setTipTimeoutId] = useState<NodeJS.Timeout | null>(null)

  useEffect(() => {
    // Shuffle content when the component mounts or discipline changes
    const exercises = originalContent.filter((item) => item.type === "exercise")
    const lessons = originalContent.filter((item) => item.type === "lesson")
    setShuffledContent(shuffleArray(exercises).concat(lessons))
    setCurrentContentIndex(0)
    setUserAnswer("")
    setFeedbackMessage("")
    setIsAnswerCorrect(false)
    setHasAnswered(false)

    // Set initial teacher message
    setTeacherMessage(t("teacher_intro_message", { disciplineName: disciplineName }))
    setShowTeacherBubble(true) // Ensure bubble is shown on discipline start
  }, [disciplineSlug, originalContent, t, disciplineName])

  const currentItem = shuffledContent[currentContentIndex]

  const translatedTitle = currentItem && currentItem.title ? t(currentItem.title) : ""
  const translatedText = currentItem && currentItem.text ? t(currentItem.text) : undefined
  const translatedQuestion = currentItem && currentItem.question ? t(currentItem.question) : undefined
  const translatedCorrectAnswer = currentItem && currentItem.correctAnswer ? t(currentItem.correctAnswer) : undefined

  const handleCheckAnswer = () => {
    if (!currentItem || currentItem.type !== "exercise") return

    setHasAnswered(true)
    if (userAnswer.toLowerCase() === translatedCorrectAnswer?.toLowerCase()) {
      setFeedbackMessage(t("correct_answer_xp"))
      setIsAnswerCorrect(true)
      addXP(1) // Each correct answer gives 1 XP
    } else {
      setFeedbackMessage(t("incorrect_answer_try_again"))
      setIsAnswerCorrect(false)
    }
  }

  const handleNext = () => {
    if (currentContentIndex < shuffledContent.length - 1) {
      setCurrentContentIndex(currentContentIndex + 1)
      setUserAnswer("")
      setFeedbackMessage("")
      setIsAnswerCorrect(false)
      setHasAnswered(false)
      setCurrentTipMessage(null) // Clear tip message on next question
      if (tipTimeoutId) clearTimeout(tipTimeoutId)
    } else {
      setFeedbackMessage(t("discipline_completed"))
    }
  }

  const handleCloseTeacherBubble = () => {
    setShowTeacherBubble(false)
  }

  const handleShowTip = () => {
    setCurrentTipMessage(t("tip_message"))
    if (tipTimeoutId) clearTimeout(tipTimeoutId)
    const id = setTimeout(() => {
      setCurrentTipMessage(null)
    }, 3000) // Show for 3 seconds
    setTipTimeoutId(id)
  }

  if (!currentItem) {
    return (
      <div
        className="flex h-screen overflow-hidden flex-col items-center justify-center p-0 text-white"
        style={{
          backgroundImage: 'url("/images/school-background.png")',
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <BackButton href="/agenda" />
        <h1 className="text-3xl font-bold mb-8 capitalize font-mono">{disciplineName}</h1>
        <p className="text-lg text-center font-mono">{t("no_content_found")}</p>
      </div>
    )
  }

  return (
    <div
      className="relative flex h-screen overflow-hidden flex-col items-center justify-center p-0"
      style={{
        backgroundImage: 'url("/images/school-background.png")',
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <BackButton href="/agenda" />

      {/* Teacher Image and Speech Bubble */}
      <div className="fixed bottom-0 left-0 z-40">
        {" "}
        {/* Changed from right-0 to left-0 */}
        <TeacherImage />
      </div>
      {showTeacherBubble && (
        <SpeechBubble
          text={teacherMessage}
          onClose={handleCloseTeacherBubble}
          positionClasses="fixed bottom-[10px] left-[100px] md:bottom-[10px] md:left-[100px] lg:bottom-[10px] lg:left-[100px]" // Adjusted position to be right of teacher and lower
          buttons={[{ label: t("ok_got_it"), onClick: handleCloseTeacherBubble }]}
        />
      )}

      <div
        className={cn(
          "relative w-full aspect-[1.6/1] flex flex-col items-center justify-center p-0",
          disciplineSlug === "geography" ? "max-w-screen-2xl" : "max-w-full",
        )}
      >
        <Image
          src="/images/quadrosf.png"
          alt="School Board"
          layout="fill"
          objectFit="contain"
          className="drop-shadow-lg"
        />
        <div className="absolute inset-0 flex flex-col items-center justify-center p-24 text-white font-mono">
          {currentItem.type === "lesson" && (
            <h2 className="text-sm font-semibold mb-2 text-center">{translatedTitle}</h2>
          )}
          {currentItem.type === "lesson" && <p className="text-[0.65rem] text-center max-w-4xl">{translatedText}</p>}
          {currentItem.type === "exercise" && (
            <div className="flex flex-col items-center gap-2 w-full max-w-md">
              <p className="text-[0.65rem] text-center flex items-center justify-center gap-1">
                {translatedQuestion}
                <Lightbulb
                  className="w-4 h-4 text-yellow-300 cursor-pointer"
                  onClick={handleShowTip}
                  aria-label={t("show_tip")}
                />
              </p>
              {currentTipMessage && (
                <span className="text-[0.6rem] text-yellow-200 animate-fade-in-out">{currentTipMessage}</span>
              )}
              <Input
                type="text"
                value={userAnswer}
                onChange={(e) => setUserAnswer(e.target.value)}
                placeholder={t("your_answer")}
                className="w-full bg-white/80 text-gray-900 placeholder:text-gray-500 border-yellow-400 text-base"
                disabled={isAnswerCorrect}
              />
              {!isAnswerCorrect && (
                <Button
                  onClick={handleCheckAnswer}
                  className="bg-yellow-600 hover:bg-yellow-700 text-white text-[0.65rem] py-1 h-auto"
                  disabled={userAnswer.trim() === ""}
                >
                  {t("check_answer")}
                </Button>
              )}
              {feedbackMessage && (
                <p className={`text-[0.65rem] font-bold ${isAnswerCorrect ? "text-green-400" : "text-red-400"}`}>
                  {feedbackMessage}
                </p>
              )}
            </div>
          )}
          {(currentItem.type === "lesson" || (currentItem.type === "exercise" && isAnswerCorrect)) && (
            <Button
              onClick={handleNext}
              className="mt-4 bg-blue-600 hover:bg-blue-700 text-white text-[0.65rem] py-1 h-auto"
            >
              {currentContentIndex < shuffledContent.length - 1 ? t("next") : t("complete_discipline")}
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
