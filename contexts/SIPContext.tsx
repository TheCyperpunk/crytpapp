"use client"

import type React from "react"
import { createContext, useContext, useState } from "react"

interface SIPPlan {
  id: string
  token: string
  totalAmount: number
  intervalAmount: number
  frequency: string
  nextExecution: string
  status: "active" | "completed" | "paused"
  progress: number
}

interface SIPContextType {
  plans: SIPPlan[]
  createPlan: (planData: any) => Promise<void>
  executeSIP: (planId: string) => Promise<void>
  finalizeSIP: (planId: string) => Promise<void>
  getPlan: (planId: string) => SIPPlan | undefined
}

const SIPContext = createContext<SIPContextType | undefined>(undefined)

export function SIPProvider({ children }: { children: React.ReactNode }) {
  const [plans, setPlans] = useState<SIPPlan[]>([
    {
      id: "1",
      token: "BTC",
      totalAmount: 1000,
      intervalAmount: 100,
      frequency: "Monthly",
      nextExecution: "2024-02-15",
      status: "active",
      progress: 60,
    },
    {
      id: "2",
      token: "ETH",
      totalAmount: 500,
      intervalAmount: 50,
      frequency: "Weekly",
      nextExecution: "2024-01-22",
      status: "active",
      progress: 80,
    },
  ])

  const createPlan = async (planData: any) => {
    // Mock smart contract interaction
    const newPlan: SIPPlan = {
      id: Date.now().toString(),
      ...planData,
      status: "active" as const,
      progress: 0,
      nextExecution: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
    }
    setPlans((prev) => [...prev, newPlan])
  }

  const executeSIP = async (planId: string) => {
    // Mock smart contract interaction
    setPlans((prev) =>
      prev.map((plan) => (plan.id === planId ? { ...plan, progress: Math.min(plan.progress + 10, 100) } : plan)),
    )
  }

  const finalizeSIP = async (planId: string) => {
    // Mock smart contract interaction
    setPlans((prev) => prev.map((plan) => (plan.id === planId ? { ...plan, status: "completed" as const } : plan)))
  }

  const getPlan = (planId: string) => {
    return plans.find((plan) => plan.id === planId)
  }

  return (
    <SIPContext.Provider
      value={{
        plans,
        createPlan,
        executeSIP,
        finalizeSIP,
        getPlan,
      }}
    >
      {children}
    </SIPContext.Provider>
  )
}

export function useSIP() {
  const context = useContext(SIPContext)
  if (context === undefined) {
    throw new Error("useSIP must be used within a SIPProvider")
  }
  return context
}
