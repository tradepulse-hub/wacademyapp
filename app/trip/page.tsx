"use client"

import { useState } from "react" // Import useState
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ChevronLeft, Loader2 } from "lucide-react" // Import Loader2
import Image from "next/image"
import { useI18n } from "@/i18n/use-i18n"

export default function TripPage() {
  const router = useRouter()
  const { t } = useI18n()

  const [isBuyingTickets, setIsBuyingTickets] = useState(false)
  const [purchaseMessage, setPurchaseMessage] = useState<string | null>(null)

  const destinationWallet = "0xf04a78df4cc3017c0c23f37528d7b6cbbeea6677"
  const ticketValue = 5 // Value in WLD

  const handleBuyTickets = async () => {
    setIsBuyingTickets(true)
    setPurchaseMessage(null) // Clear previous messages

    // Simulate token transfer
    await new Promise((resolve) => setTimeout(resolve, 2000)) // Simulate network delay

    // In a real application, you would integrate with a blockchain wallet here
    // For now, we just simulate success
    setPurchaseMessage(t("ticket_purchase_success", { value: ticketValue, address: destinationWallet }))
    setIsBuyingTickets(false)
  }

  return (
    <div
      className="relative flex h-screen overflow-hidden flex-col items-center justify-center p-4 text-white"
      style={{
        backgroundImage: 'url("/images/map-background.png")',
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <Button
        variant="ghost"
        onClick={() => router.back()}
        className="absolute top-4 left-4 text-white bg-black hover:bg-gray-800"
      >
        <ChevronLeft className="h-6 w-6" />
        {t("back")}
      </Button>

      {/* Container para as janelas dos países, centralizado */}
      <div className="flex flex-wrap justify-center items-center gap-8 p-4 z-30">
        {/* Portugal Window */}
        <div className="flex flex-col items-center gap-2 cursor-pointer">
          <div className="relative w-40 h-40 border-4 border-white rounded-lg overflow-hidden shadow-lg">
            <Image
              src="/images/portugal-monument.png"
              alt="Portuguese Monument"
              layout="fill"
              objectFit="cover"
              className="transition-transform duration-300 hover:scale-105"
            />
          </div>
          <span className="text-lg font-semibold text-white">{t("country_portugal")}</span>
        </div>

        {/* "More countries soon" Window */}
        <div className="flex flex-col items-center gap-2">
          <div className="relative w-40 h-40 border-4 border-white rounded-lg overflow-hidden shadow-lg flex items-center justify-center bg-gray-800/70 text-center p-2">
            <span className="text-sm font-medium text-gray-300">{t("more_countries_soon")}</span>
          </div>
          <span className="text-lg font-semibold text-white">{t("coming_soon")}</span>
        </div>
      </div>

      {/* Buy Tickets Section */}
      <div className="absolute bottom-10 w-full max-w-md px-4 z-40">
        <Button
          onClick={handleBuyTickets}
          disabled={isBuyingTickets}
          className="w-full py-3 text-lg font-bold bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg shadow-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-300"
        >
          {isBuyingTickets ? (
            <span className="flex items-center justify-center">
              <Loader2 className="mr-2 h-5 w-5 animate-spin" /> {t("buying_tickets")}
            </span>
          ) : (
            t("buy_tickets")
          )}
        </Button>
        {purchaseMessage && <p className="mt-3 text-center text-sm font-medium text-green-400">{purchaseMessage}</p>}
      </div>
    </div>
  )
}
