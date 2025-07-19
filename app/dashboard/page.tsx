"use client"

import { useState } from "react"
import Navbar from "@/components/Navbar"
import { useSIP } from "@/contexts/SIPContext"
import { useWallet } from "@/contexts/WalletContext"
import { Play, Square, TrendingUp, Calendar, DollarSign, Activity } from "lucide-react"

export default function DashboardPage() {
  const { plans, executeSIP, finalizeSIP } = useSIP()
  const { isConnected, balance } = useWallet()
  const [executingPlan, setExecutingPlan] = useState<string | null>(null)
  const [finalizingPlan, setFinalizingPlan] = useState<string | null>(null)

  const handleExecuteSIP = async (planId: string) => {
    setExecutingPlan(planId)
    try {
      await executeSIP(planId)
    } catch (error) {
      console.error("Failed to execute SIP:", error)
    } finally {
      setExecutingPlan(null)
    }
  }

  const handleFinalizeSIP = async (planId: string) => {
    setFinalizingPlan(planId)
    try {
      await finalizeSIP(planId)
    } catch (error) {
      console.error("Failed to finalize SIP:", error)
    } finally {
      setFinalizingPlan(null)
    }
  }

  const totalInvested = plans.reduce((sum, plan) => sum + (plan.totalAmount * plan.progress) / 100, 0)
  const totalValue = totalInvested * 1.15 // Mock 15% gain
  const totalGain = totalValue - totalInvested

  if (!isConnected) {
    return (
      <div className="min-h-screen bg-[#0e1324]">
        <Navbar />
        <div className="pt-24 pb-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <div className="card-glow rounded-2xl p-12">
              <h1 className="text-3xl font-bold gradient-text mb-4">Connect Your Wallet</h1>
              <p className="text-gray-300 text-lg">Please connect your wallet to view your investment dashboard</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#0e1324]">
      <Navbar />

      <div className="pt-24 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-12">
            <h1 className="text-4xl font-bold gradient-text mb-4">Investment Dashboard</h1>
            <p className="text-gray-300 text-lg">Monitor and manage your systematic investment plans</p>
          </div>

          {/* Portfolio Overview */}
          <div className="grid md:grid-cols-4 gap-6 mb-12">
            <div className="card-glow rounded-xl p-6">
              <div className="flex items-center space-x-3 mb-2">
                <DollarSign className="w-6 h-6 text-blue-400" />
                <span className="text-gray-400 text-sm">Total Invested</span>
              </div>
              <div className="text-2xl font-bold text-white">${totalInvested.toFixed(2)}</div>
            </div>

            <div className="card-glow rounded-xl p-6">
              <div className="flex items-center space-x-3 mb-2">
                <TrendingUp className="w-6 h-6 text-green-400" />
                <span className="text-gray-400 text-sm">Current Value</span>
              </div>
              <div className="text-2xl font-bold text-white">${totalValue.toFixed(2)}</div>
            </div>

            <div className="card-glow rounded-xl p-6">
              <div className="flex items-center space-x-3 mb-2">
                <Activity className="w-6 h-6 text-purple-400" />
                <span className="text-gray-400 text-sm">Total Gain</span>
              </div>
              <div className="text-2xl font-bold text-green-400">+${totalGain.toFixed(2)}</div>
              <div className="text-sm text-green-400">+{((totalGain / totalInvested) * 100).toFixed(1)}%</div>
            </div>

            <div className="card-glow rounded-xl p-6">
              <div className="flex items-center space-x-3 mb-2">
                <Calendar className="w-6 h-6 text-yellow-400" />
                <span className="text-gray-400 text-sm">Active Plans</span>
              </div>
              <div className="text-2xl font-bold text-white">{plans.filter((p) => p.status === "active").length}</div>
            </div>
          </div>

          {/* SIP Plans */}
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-white mb-6">Your SIP Plans</h2>

            {plans.length === 0 ? (
              <div className="card-glow rounded-xl p-12 text-center">
                <div className="text-gray-400 text-lg mb-4">No investment plans found</div>
                <a
                  href="/invest"
                  className="inline-flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 rounded-lg transition-all glow-effect"
                >
                  <span>Create Your First SIP</span>
                </a>
              </div>
            ) : (
              <div className="grid gap-6">
                {plans.map((plan) => (
                  <div key={plan.id} className="card-glow rounded-xl p-6">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
                      {/* Plan Info */}
                      <div className="flex-1">
                        <div className="flex items-center space-x-4 mb-4">
                          <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                            <span className="text-white font-bold">{plan.token}</span>
                          </div>
                          <div>
                            <h3 className="text-xl font-bold text-white">{plan.token} Investment Plan</h3>
                            <div className="flex items-center space-x-4 text-sm text-gray-400">
                              <span>${plan.totalAmount.toLocaleString()} Total</span>
                              <span>
                                ${plan.intervalAmount.toFixed(2)} {plan.frequency}
                              </span>
                              <span
                                className={`px-2 py-1 rounded-full text-xs ${
                                  plan.status === "active"
                                    ? "bg-green-500/20 text-green-400"
                                    : plan.status === "completed"
                                      ? "bg-blue-500/20 text-blue-400"
                                      : "bg-yellow-500/20 text-yellow-400"
                                }`}
                              >
                                {plan.status.toUpperCase()}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Progress Bar */}
                        <div className="mb-4">
                          <div className="flex justify-between text-sm text-gray-400 mb-2">
                            <span>Progress</span>
                            <span>{plan.progress}%</span>
                          </div>
                          <div className="w-full bg-gray-700 rounded-full h-2">
                            <div
                              className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all duration-300"
                              style={{ width: `${plan.progress}%` }}
                            />
                          </div>
                        </div>

                        <div className="text-sm text-gray-400">
                          Next execution: {new Date(plan.nextExecution).toLocaleDateString()}
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex space-x-3">
                        {plan.status === "active" && (
                          <button
                            onClick={() => handleExecuteSIP(plan.id)}
                            disabled={executingPlan === plan.id}
                            className="flex items-center space-x-2 px-4 py-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-600 rounded-lg transition-all"
                          >
                            <Play size={16} />
                            <span>{executingPlan === plan.id ? "Executing..." : "Execute"}</span>
                          </button>
                        )}

                        {plan.status === "active" && plan.progress >= 100 && (
                          <button
                            onClick={() => handleFinalizeSIP(plan.id)}
                            disabled={finalizingPlan === plan.id}
                            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 rounded-lg transition-all"
                          >
                            <Square size={16} />
                            <span>{finalizingPlan === plan.id ? "Finalizing..." : "Finalize"}</span>
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
