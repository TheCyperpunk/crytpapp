"use client"

import { useState } from "react"
import Navbar from "@/components/Navbar"
import { useSIP } from "@/contexts/SIPContext"
import { useWallet } from "@/contexts/WalletContext"
import { Play, Square, TrendingUp, Copy, ExternalLink, User, History, Briefcase } from "lucide-react"

export default function ProfilePage() {
  const { plans, executeSIP, finalizeSIP } = useSIP()
  const { isConnected, balance, account } = useWallet()
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

  const handleCopyAddress = () => {
    if (account) {
      navigator.clipboard.writeText(account)
    }
  }

  const totalInvested = plans.reduce((sum, plan) => sum + (plan.totalAmount * plan.progress) / 100, 0)
  const totalValue = totalInvested * 1.185 // Mock 18.5% gain
  const totalGain = totalValue - totalInvested

  // Mock data for current positions
  const currentPositions = [
    {
      symbol: "wBTC",
      name: "Wrapped Bitcoin",
      amount: "0.0234",
      value: 1234.56,
      change: 15.2,
      color: "text-orange-400",
    },
    { symbol: "wETH", name: "Wrapped Ethereum", amount: "0.845", value: 2156.78, change: 8.7, color: "text-blue-400" },
    { symbol: "BNB", name: "BNB Chain", amount: "12.5", value: 456.89, change: -2.1, color: "text-yellow-400" },
    { symbol: "wSOL", name: "Wrapped Solana", amount: "45.2", value: 890.34, change: 22.3, color: "text-purple-400" },
  ]

  // Mock transaction history
  const transactionHistory = [
    { date: "2024-01-15", token: "BTC", type: "Swap", amount: "+0.025 wBTC", value: "+$850.00", hash: "0x1234...5678" },
    { date: "2024-01-14", token: "ETH", type: "SIP", amount: "+0.5 wETH", value: "+$1,290.00", hash: "0x2345...6789" },
    { date: "2024-01-13", token: "BNB", type: "Swap", amount: "+2.1 BNB", value: "+$661.50", hash: "0x3456...7890" },
    { date: "2024-01-12", token: "SOL", type: "SIP", amount: "+8.3 wSOL", value: "+$813.40", hash: "0x4567...8901" },
  ]

  if (!isConnected) {
    return (
      <div className="min-h-screen bg-[#0e1324]">
        <Navbar />
        <div className="pt-24 pb-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <div className="card-glow rounded-2xl p-12">
              <h1 className="text-3xl font-bold gradient-text mb-4">Connect Your Wallet</h1>
              <p className="text-gray-300 text-lg">Please connect your wallet to view your investment profile</p>
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
            <h1 className="text-4xl font-bold gradient-text mb-4">Profile</h1>
            <p className="text-gray-300 text-lg">Your investment portfolio overview and transaction history.</p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Left Column */}
            <div className="lg:col-span-1 space-y-6">
              {/* Wallet Address */}
              <div className="card-glow rounded-xl p-6">
                <div className="flex items-center space-x-3 mb-4">
                  <User className="w-6 h-6 text-blue-400" />
                  <h2 className="text-xl font-bold text-white">Wallet Address</h2>
                </div>
                <div className="bg-gray-800/50 rounded-lg p-4 mb-4">
                  <div className="text-sm text-gray-300 font-mono break-all">
                    {account || "0x742d35Cc6734C0532925a3b801C9A4C8F6"}
                  </div>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={handleCopyAddress}
                    className="flex items-center space-x-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-all text-sm"
                  >
                    <Copy size={16} />
                    <span>Copy</span>
                  </button>
                  <button className="flex items-center space-x-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-all text-sm">
                    <ExternalLink size={16} />
                    <span>BSCScan</span>
                  </button>
                </div>
              </div>

              {/* Portfolio Summary */}
              <div className="card-glow rounded-xl p-6 bg-gradient-to-br from-green-900/20 to-green-800/20 border-green-500/20">
                <div className="flex items-center space-x-3 mb-4">
                  <TrendingUp className="w-6 h-6 text-green-400" />
                  <h2 className="text-xl font-bold text-white">Portfolio Summary</h2>
                </div>
                <div className="space-y-4">
                  <div>
                    <div className="text-sm text-gray-300">Total Portfolio Value</div>
                    <div className="text-3xl font-bold text-white">${totalValue.toFixed(2)}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-300">Total Growth</div>
                    <div className="text-xl font-bold text-green-400">
                      +{((totalGain / totalInvested) * 100).toFixed(1)}%
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-300">Wallet Balance</div>
                    <div className="text-xl font-bold text-white">${balance} USDT</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column */}
            <div className="lg:col-span-2 space-y-6">
              {/* Current Positions */}
              <div className="card-glow rounded-xl p-6">
                <div className="flex items-center space-x-3 mb-6">
                  <Briefcase className="w-6 h-6 text-purple-400" />
                  <h2 className="text-xl font-bold text-white">Current Positions</h2>
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  {currentPositions.map((position, index) => (
                    <div key={index} className="bg-gray-800/50 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-3">
                          <div
                            className={`w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center`}
                          >
                            <span className="text-white text-sm font-bold">{position.symbol.slice(0, 1)}</span>
                          </div>
                          <div>
                            <div className="font-bold text-white">{position.symbol}</div>
                            <div className="text-sm text-gray-400">{position.amount}</div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-bold text-white">${position.value.toFixed(2)}</div>
                          <div className={`text-sm ${position.change > 0 ? "text-green-400" : "text-red-400"}`}>
                            {position.change > 0 ? "+" : ""}
                            {position.change.toFixed(1)}%
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Transaction History */}
              <div className="card-glow rounded-xl p-6">
                <div className="flex items-center space-x-3 mb-6">
                  <History className="w-6 h-6 text-blue-400" />
                  <h2 className="text-xl font-bold text-white">Transaction History</h2>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-700">
                        <th className="text-left py-3 text-gray-400 font-medium">Date</th>
                        <th className="text-left py-3 text-gray-400 font-medium">Token</th>
                        <th className="text-left py-3 text-gray-400 font-medium">Type</th>
                        <th className="text-left py-3 text-gray-400 font-medium">Amount</th>
                        <th className="text-left py-3 text-gray-400 font-medium">Value</th>
                        <th className="text-left py-3 text-gray-400 font-medium">Tx Hash</th>
                      </tr>
                    </thead>
                    <tbody>
                      {transactionHistory.map((tx, index) => (
                        <tr key={index} className="border-b border-gray-800">
                          <td className="py-3 text-gray-300">{tx.date}</td>
                          <td className="py-3 text-white font-medium">{tx.token}</td>
                          <td className="py-3">
                            <span
                              className={`px-2 py-1 rounded-full text-xs ${
                                tx.type === "SIP" ? "bg-blue-500/20 text-blue-400" : "bg-green-500/20 text-green-400"
                              }`}
                            >
                              {tx.type}
                            </span>
                          </td>
                          <td className="py-3 text-green-400">{tx.amount}</td>
                          <td className="py-3 text-green-400">{tx.value}</td>
                          <td className="py-3">
                            <button className="text-blue-400 hover:text-blue-300 transition-colors">
                              <ExternalLink size={16} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Active SIP Plans */}
              {plans.length > 0 && (
                <div className="card-glow rounded-xl p-6">
                  <h2 className="text-xl font-bold text-white mb-6">Active SIP Plans</h2>
                  <div className="space-y-4">
                    {plans.map((plan) => (
                      <div key={plan.id} className="bg-gray-800/50 rounded-lg p-4">
                        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
                          <div className="flex-1">
                            <div className="flex items-center space-x-4 mb-3">
                              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                                <span className="text-white font-bold text-sm">{plan.token}</span>
                              </div>
                              <div>
                                <h3 className="font-bold text-white">{plan.token} Investment Plan</h3>
                                <div className="flex items-center space-x-4 text-sm text-gray-400">
                                  <span>${plan.totalAmount.toLocaleString()} Total</span>
                                  <span>
                                    ${plan.intervalAmount.toFixed(2)} {plan.frequency}
                                  </span>
                                  <span
                                    className={`px-2 py-1 rounded-full text-xs ${
                                      plan.status === "active"
                                        ? "bg-green-500/20 text-green-400"
                                        : "bg-blue-500/20 text-blue-400"
                                    }`}
                                  >
                                    {plan.status.toUpperCase()}
                                  </span>
                                </div>
                              </div>
                            </div>
                            <div className="mb-3">
                              <div className="flex justify-between text-sm text-gray-400 mb-1">
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
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
