"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ChevronLeft } from "lucide-react"

export default function BackButton() {
  const router = useRouter()

  const handleBack = () => {
    router.back()
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={handleBack}
      className="absolute top-4 left-4 z-50 text-gray-800 hover:bg-gray-200"
      aria-label="Go back"
    >
      <ChevronLeft className="h-6 w-6" />
    </Button>
  )
}
