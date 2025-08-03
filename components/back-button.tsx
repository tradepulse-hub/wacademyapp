"use client"

import { Button } from "@/components/ui/button"
import { ChevronLeft } from "lucide-react"
import { useRouter } from "next/navigation"
import { useI18n } from "@/i18n/use-i18n"

interface BackButtonProps {
  href?: string
  className?: string
}

export default function BackButton({ href, className }: BackButtonProps) {
  const router = useRouter()
  const { t } = useI18n()

  const handleClick = () => {
    if (href) {
      router.push(href)
    } else {
      router.back()
    }
  }

  return (
    <Button variant="ghost" onClick={handleClick} className={`text-white bg-black hover:bg-gray-800 ${className}`}>
      <ChevronLeft className="h-6 w-6" />
      {t("back")}
    </Button>
  )
}
