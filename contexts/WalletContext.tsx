"use client"

import type React from "react"
import { createContext, useContext, useState } from "react"

interface WalletContextType {
  account: string | null
  isConnected: boolean
  balance: string
  connectWallet: () => Promise<void>
  disconnectWallet: () => void
}

const WalletContext = createContext<WalletContextType | undefined>(undefined)

export function WalletProvider({ children }: { children: React.ReactNode }) {
  const [account, setAccount] = useState<string | null>(null)
  const [balance, setBalance] = useState("0.00")

  const connectWallet = async () => {
    if (typeof window !== "undefined" && window.ethereum) {
      try {
        const accounts = await window.ethereum.request({
          method: "eth_requestAccounts",
        })
        setAccount(accounts[0])
        // Mock balance for demo
        setBalance("1,234.56")
      } catch (error) {
        console.error("Failed to connect wallet:", error)
      }
    }
  }

  const disconnectWallet = () => {
    setAccount(null)
    setBalance("0.00")
  }

  const isConnected = !!account

  return (
    <WalletContext.Provider
      value={{
        account,
        isConnected,
        balance,
        connectWallet,
        disconnectWallet,
      }}
    >
      {children}
    </WalletContext.Provider>
  )
}

export function useWallet() {
  const context = useContext(WalletContext)
  if (context === undefined) {
    throw new Error("useWallet must be used within a WalletProvider")
  }
  return context
}
