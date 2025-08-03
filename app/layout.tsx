import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { I18nProvider } from "@/i18n/i18n-provider"
import { MiniKitProvider } from "@/components/minikit-provider" // Import MiniKitProvider

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "World Academy",
  description: "Learn and earn tokens!",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <I18nProvider>
            <MiniKitProvider>
              {" "}
              {/* Wrap children with MiniKitProvider */}
              {children}
            </MiniKitProvider>
          </I18nProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
