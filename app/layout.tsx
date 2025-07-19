import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { WalletProvider } from "@/contexts/WalletContext"
import { SIPProvider } from "@/contexts/SIPContext"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Onchain SIP - Decentralized Investment Platform",
  description: "Systematic Investment Plan on BNB Testnet",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} bg-[#0e1324] text-white min-h-screen`}>
        <WalletProvider>
          <SIPProvider>{children}</SIPProvider>
        </WalletProvider>
      </body>
    </html>
  )
}
