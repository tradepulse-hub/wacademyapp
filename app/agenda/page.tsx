"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Calendar } from "@/components/ui/calendar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CalendarDays, Plane, ArrowLeftRight, Trophy, BookOpen, Clock, Star } from "lucide-react"
import { useAuth } from "@/hooks/use-auth"
import { useXP } from "@/hooks/use-xp"
import { useI18n } from "@/i18n/use-i18n"

interface AgendaEvent {
  id: string
  title: string
  date: Date
  type: "lesson" | "exam" | "assignment" | "event"
  subject: string
  completed?: boolean
  xpReward?: number
}

export default function AgendaPage() {
  const router = useRouter()
  const { user } = useAuth()
  const { xp, level, addXP } = useXP()
  const { t } = useI18n()
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date())
  const [events, setEvents] = useState<AgendaEvent[]>([])
  const [showLevelUpModal, setShowLevelUpModal] = useState(false)

  // Mock events data
  useEffect(() => {
    const mockEvents: AgendaEvent[] = [
      {
        id: "1",
        title: t("agenda.mathQuiz"),
        date: new Date(),
        type: "exam",
        subject: "Mathematics",
        xpReward: 50,
      },
      {
        id: "2",
        title: t("agenda.historyEssay"),
        date: new Date(Date.now() + 86400000), // Tomorrow
        type: "assignment",
        subject: "History",
        xpReward: 75,
      },
      {
        id: "3",
        title: t("agenda.scienceLab"),
        date: new Date(Date.now() + 172800000), // Day after tomorrow
        type: "lesson",
        subject: "Science",
        xpReward: 30,
      },
    ]
    setEvents(mockEvents)
  }, [t])

  const handleCompleteEvent = (eventId: string) => {
    setEvents((prev) => prev.map((event) => (event.id === eventId ? { ...event, completed: true } : event)))

    const event = events.find((e) => e.id === eventId)
    if (event?.xpReward) {
      const newLevel = addXP(event.xpReward)
      if (newLevel > level) {
        setShowLevelUpModal(true)
      }
    }
  }

  const getEventsForDate = (date: Date) => {
    return events.filter((event) => event.date.toDateString() === date.toDateString())
  }

  const getEventIcon = (type: string) => {
    switch (type) {
      case "lesson":
        return <BookOpen className="w-4 h-4" />
      case "exam":
        return <Trophy className="w-4 h-4" />
      case "assignment":
        return <Clock className="w-4 h-4" />
      default:
        return <CalendarDays className="w-4 h-4" />
    }
  }

  const getEventColor = (type: string) => {
    switch (type) {
      case "lesson":
        return "bg-blue-100 text-blue-800"
      case "exam":
        return "bg-red-100 text-red-800"
      case "assignment":
        return "bg-yellow-100 text-yellow-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-lg">
            <CalendarDays className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-800">{t("agenda.title")}</h1>
            <p className="text-gray-600">{t("agenda.subtitle")}</p>
          </div>
        </div>

        {/* XP Display */}
        <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-lg">
          <Star className="w-5 h-5 text-yellow-500" />
          <span className="font-semibold text-gray-800">{xp} XP</span>
          <Badge variant="secondary">Level {level}</Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendar */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CalendarDays className="w-5 h-5" />
              {t("agenda.calendar")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Calendar mode="single" selected={selectedDate} onSelect={setSelectedDate} className="rounded-md border" />
          </CardContent>
        </Card>

        {/* Events List */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="w-5 h-5" />
              {selectedDate ? `${t("agenda.eventsFor")} ${selectedDate.toLocaleDateString()}` : t("agenda.allEvents")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {selectedDate && getEventsForDate(selectedDate).length > 0 ? (
                getEventsForDate(selectedDate).map((event) => (
                  <div key={event.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      {getEventIcon(event.type)}
                      <div>
                        <h3 className="font-semibold text-gray-800">{event.title}</h3>
                        <p className="text-sm text-gray-600">{event.subject}</p>
                      </div>
                      <Badge className={getEventColor(event.type)}>{t(`agenda.${event.type}`)}</Badge>
                    </div>
                    <div className="flex items-center gap-2">
                      {event.xpReward && (
                        <Badge variant="outline" className="text-yellow-600">
                          +{event.xpReward} XP
                        </Badge>
                      )}
                      {!event.completed ? (
                        <Button size="sm" onClick={() => handleCompleteEvent(event.id)}>
                          {t("agenda.complete")}
                        </Button>
                      ) : (
                        <Badge className="bg-green-100 text-green-800">{t("agenda.completed")}</Badge>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <CalendarDays className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>{t("agenda.noEvents")}</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Floating Action Buttons */}
      <div className="fixed right-6 bottom-6 flex flex-col gap-4">
        {/* Trip Button */}
        <button
          onClick={() => router.push("/trip")}
          className="w-14 h-14 bg-white rounded-full shadow-lg flex items-center justify-center hover:shadow-xl transition-shadow"
        >
          <Plane className="w-6 h-6 text-black" />
        </button>

        {/* Swap Icon below Plane Icon */}
        <ArrowLeftRight className="h-6 w-6 text-gray-600 cursor-pointer" onClick={() => router.push("/wallet")} />

        {/* Swap Button */}
        {/* <button
          onClick={() => router.push("/wallet")}
          className="w-14 h-14 bg-white rounded-full shadow-lg flex items-center justify-center hover:shadow-xl transition-shadow"
        >
          <ArrowLeftRight className="w-6 h-6 text-black" />
        </button> */}
      </div>

      {/* Level Up Modal */}
      {showLevelUpModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Card className="w-80 mx-4">
            <CardContent className="text-center p-6">
              <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Trophy className="w-8 h-8 text-yellow-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">{t("agenda.levelUp")}!</h2>
              <p className="text-gray-600 mb-4">
                {t("agenda.reachedLevel")} {level}!
              </p>
              <Button onClick={() => setShowLevelUpModal(false)} className="w-full">
                {t("agenda.continue")}
              </Button>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
