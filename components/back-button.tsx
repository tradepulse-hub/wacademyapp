"use client"

import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation" // Import useRouter
import { useI18n } from "@/i18n/use-i18n" // Import useI18n

interface BackButtonProps {
  href?: string // Optional, where the button should navigate
  className?: string // Additional classes for styling
}

export default function BackButton({ href = "/agenda", className }: BackButtonProps) {
  const router = useRouter() // Initialize useRouter
  const { t } = useI18n() // Use the i18n hook

  return (
    <Button
      variant="ghost"
      onClick={() => {
        // Using router.push for Next.js navigation
        router.push(href)
      }}
      className={`absolute top-4 left-4 text-white bg-black hover:bg-gray-800 ${className || ""} z-50`}
    >
      {t("back")} {/* Translated "Back" */}
    </Button>
  )
}
