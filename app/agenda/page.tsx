"use client"

import { ArrowLeftRight, Calendar, Clock, MapPin, Plane, Trophy, Users } from "lucide-react"
import { useRouter } from "next/router"
import Button from "@/components/ui/button" // Assuming Button component is imported from this path

const AgendaPage = () => {
  const router = useRouter()

  return (
    <div>
      {/* Top Section */}
      <div className="flex justify-between items-center p-4">
        {/* Left Section */}
        <div className="flex items-center space-x-4">
          <Calendar className="h-6 w-6 text-gray-600" />
          <Clock className="h-6 w-6 text-gray-600" />
          <MapPin className="h-6 w-6 text-gray-600" />
        </div>
        {/* Right Section */}
        <div className="flex items-center space-x-4">
          <Plane className="h-6 w-6 text-gray-600" />
          {/* Swap Icon */}
          <div
            className="cursor-pointer rounded-full bg-blue-500/20 p-3 transition-all hover:bg-blue-500/30"
            onClick={() => router.push("/mini-wallet")}
          >
            <ArrowLeftRight className="h-6 w-6 text-blue-600" />
          </div>
          <Users className="h-6 w-6 text-gray-600" />
          <Trophy className="h-6 w-6 text-gray-600" />
        </div>
      </div>
      {/* Main Content */}
      <div className="p-4">
        {/* Placeholder for main content */}
        <p>Agenda content goes here</p>
      </div>
      {/* Swap Button below Plane button */}
      <Button
        variant="ghost"
        size="icon"
        onClick={() => router.push("/wallet")}
        className="absolute bottom-48 right-4 z-20 h-10 w-10 rounded-full bg-white border border-black text-black shadow-lg hover:bg-gray-100 transition-all duration-200"
        aria-label="Wallet Swap"
      >
        <ArrowLeftRight className="h-6 w-6" />
      </Button>
    </div>
  )
}

export default AgendaPage
