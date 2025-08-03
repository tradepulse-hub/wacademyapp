"use client"

import Image from "next/image"
import { useRouter } from "next/navigation"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useXP, XP_PER_LEVEL } from "@/hooks/use-xp"
import { cn } from "@/lib/utils"
import BackButton from "@/components/back-button"
import { useI18n } from "@/i18n/use-i18n" // Import useI18n

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
  const { t } = useI18n() // Use the i18n hook

  const { addXP } = useXP()

  const [shuffledContent, setShuffledContent] = useState<ContentItem[]>([])
  const [currentContentIndex, setCurrentContentIndex] = useState(0)
  const [userAnswer, setUserAnswer] = useState("")
  const [feedbackMessage, setFeedbackMessage] = useState("")
  const [isAnswerCorrect, setIsAnswerCorrect] = useState(false)
  const [hasAnswered, setHasAnswered] = useState(false)

  useEffect(() => {
    // Shuffle content when the component mounts or discipline changes
    const exercises = originalContent.filter((item) => item.type === "exercise")
    const lessons = originalContent.filter((item) => item.type === "lesson")
    // Shuffle exercises and then combine with lessons (or shuffle all if preferred)
    setShuffledContent(shuffleArray(exercises).concat(lessons)) // Prioritize exercises first
    setCurrentContentIndex(0) // Reset index for new content
    setUserAnswer("")
    setFeedbackMessage("")
    setIsAnswerCorrect(false)
    setHasAnswered(false)
  }, [disciplineSlug, originalContent]) // Re-shuffle if discipline changes

  const currentItem = shuffledContent[currentContentIndex]

  // Traduzir o conteúdo do item atual
  const translatedTitle = currentItem ? t(currentItem.title) : ""
  const translatedText = currentItem && currentItem.text ? t(currentItem.text) : undefined
  const translatedQuestion = currentItem && currentItem.question ? t(currentItem.question) : undefined
  const translatedCorrectAnswer = currentItem && currentItem.correctAnswer ? t(currentItem.correctAnswer) : undefined

  const handleCheckAnswer = () => {
    if (!currentItem || currentItem.type !== "exercise") return

    setHasAnswered(true)
    // Comparar a resposta do usuário com a resposta correta TRADUZIDA
    if (userAnswer.toLowerCase() === translatedCorrectAnswer?.toLowerCase()) {
      setFeedbackMessage(t("correct_answer_xp"))
      setIsAnswerCorrect(true)
      addXP(XP_PER_LEVEL)
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
    } else {
      setFeedbackMessage(t("discipline_completed"))
      // Optionally navigate back or to a completion screen
    }
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
      className="flex h-screen overflow-hidden flex-col items-center justify-center p-0"
      style={{
        backgroundImage: 'url("/images/school-background.png")',
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <BackButton href="/agenda" />
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
          <h2 className="text-sm font-semibold mb-2 text-center">{translatedTitle}</h2>
          {currentItem.type === "lesson" && <p className="text-[0.65rem] text-center max-w-4xl">{translatedText}</p>}
          {currentItem.type === "exercise" && (
            <div className="flex flex-col items-center gap-2 w-full max-w-md">
              <p className="text-[0.65rem] text-center">{translatedQuestion}</p>
              <Input
                type="text"
                value={userAnswer}
                onChange={(e) => setUserAnswer(e.target.value)}
                placeholder={t("your_answer")}
                className="w-full bg-white/80 text-gray-900 placeholder:text-gray-500 border-yellow-400 text-base" // Alterado aqui
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
