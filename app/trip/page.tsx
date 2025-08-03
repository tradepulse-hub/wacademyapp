"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ChevronLeft } from "lucide-react"
import Image from "next/image"
import { useI18n } from "@/i18n/use-i18n" // Import useI18n

export default function TripPage() {
  const router = useRouter()
  const { t } = useI18n()

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
        className="absolute top-4 left-4 text-white bg-black hover:bg-gray-800" // Added black background for visibility
      >
        <ChevronLeft className="h-6 w-6" />
        {t("back")} {/* Translated "Back" */}
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
          <span className="text-lg font-semibold text-white">{t("country_portugal")}</span>{" "}
          {/* Translated "Portugal" */}
        </div>

        {/* "More countries soon" Window */}
        <div className="flex flex-col items-center gap-2">
          <div className="relative w-40 h-40 border-4 border-white rounded-lg overflow-hidden shadow-lg flex items-center justify-center bg-gray-800/70 text-center p-2">
            <span className="text-sm font-medium text-gray-300">{t("more_countries_soon")}</span>{" "}
            {/* Translated "More countries soon..." */}
          </div>
          <span className="text-lg font-semibold text-white">{t("coming_soon")}</span> {/* Translated "Coming Soon" */}
        </div>
      </div>
    </div>
  )
}
