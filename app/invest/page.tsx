"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Navbar from "@/components/Navbar"
import { useSIP } from "@/contexts/SIPContext"
import { useWallet } from "@/contexts/WalletContext"
import { validateSIPPlan, calculateIntervalAmount, estimateGasFee } from "@/utils/sipCalculator"
import {
  ArrowLeft,
  ArrowRight,
  Bitcoin,
  EclipseIcon as Ethereum,
  BanknoteIcon as BNB,
  DollarSign,
  X,
  TrendingUp,
  Clock,
  Coins,
  Zap,
  AlertTriangle,
  Check,
} from "lucide-react"

const tokens = [
  { symbol: "BTC", name: "Bitcoin", price: 42350, icon: Bitcoin, color: "text-orange-400" },
  { symbol: "ETH", name: "Ethereum", price: 2580, icon: Ethereum, color: "text-blue-400" },
  { symbol: "BNB", name: "BNB Chain", price: 315, icon: BNB, color: "text-yellow-400" },
  { symbol: "SOL", name: "Solana", price: 98, icon: DollarSign, color: "text-purple-400" },
]

const frequencies = [
  { value: "weekly", label: "Weekly" },
  { value: "monthly", label: "Monthly" },
  { value: "yearly", label: "Yearly" },
]

export default function InvestPage() {
  const router = useRouter()
  const { createPlan } = useSIP()
  const { isConnected } = useWallet()
  const [currentStep, setCurrentStep] = useState(1)
  const [showConfirmModal, setShowConfirmModal] = useState(false)
  const [termsAccepted, setTermsAccepted] = useState(false)
  const [formData, setFormData] = useState({
    token: "",
    totalAmount: "",
    frequency: "",
    maturityMonths: "12",
  })
  const [errors, setErrors] = useState<string[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleNext = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1)
    } else if (currentStep === 4) {
      setShowConfirmModal(true)
    }
  }

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    // Prevent negative values and ensure minimum of 1
    if (value === "" || Number.parseFloat(value) >= 1) {
      setFormData({ ...formData, totalAmount: value })
    }
  }

  const handleSubmit = async () => {
    if (!isConnected) {
      alert("Please connect your wallet first")
      return
    }

    if (!termsAccepted) {
      alert("Please accept the terms and conditions")
      return
    }

    const validation = validateSIPPlan({
      totalAmount: Number.parseFloat(formData.totalAmount),
      maturityMonths: Number.parseInt(formData.maturityMonths),
      frequency: formData.frequency,
    })

    if (!validation.isValid) {
      setErrors(validation.errors)
      return
    }

    setIsSubmitting(true)
    try {
      const intervalAmount = calculateIntervalAmount(
        Number.parseFloat(formData.totalAmount),
        formData.frequency,
        Number.parseInt(formData.maturityMonths),
      )

      await createPlan({
        token: formData.token,
        totalAmount: Number.parseFloat(formData.totalAmount),
        intervalAmount,
        frequency: formData.frequency,
        maturityMonths: Number.parseInt(formData.maturityMonths),
      })

      router.push("/profile")
    } catch (error) {
      console.error("Failed to create SIP:", error)
    } finally {
      setIsSubmitting(false)
      setShowConfirmModal(false)
    }
  }

  const selectedToken = tokens.find((t) => t.symbol === formData.token)
  const intervalAmount =
    formData.totalAmount && formData.frequency
      ? calculateIntervalAmount(
          Number.parseFloat(formData.totalAmount),
          formData.frequency,
          Number.parseInt(formData.maturityMonths),
        )
      : 0
  const gasFee = estimateGasFee("createPlan")

  return (
    <div className="min-h-screen bg-[#0e1324]">
      <Navbar />

      <div className="pt-24 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold gradient-text mb-4">Create Investment Plan</h1>
            <p className="text-gray-300 text-lg">Set up your systematic investment plan in 4 simple steps</p>
          </div>

          {/* Progress Bar */}
          <div className="mb-12">
            <div className="flex justify-between items-center">
              {[1, 2, 3, 4].map((step) => (
                <div key={step} className="flex items-center">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
                      step <= currentStep ? "bg-blue-600 text-white" : "bg-gray-700 text-gray-400"
                    }`}
                  >
                    {step}
                  </div>
                  {step < 4 && (
                    <div className={`w-16 h-1 mx-2 ${step < currentStep ? "bg-blue-600" : "bg-gray-700"}`} />
                  )}
                </div>
              ))}
            </div>
            <div className="flex justify-between mt-4 text-sm text-gray-400">
              <span>Select Token</span>
              <span>Set Amount</span>
              <span>Choose Frequency</span>
              <span>Review & Confirm</span>
            </div>
          </div>

          {/* Step Content */}
          <div className="card-glow rounded-2xl p-8 mb-8">
            {/* Step 1: Select Token */}
            {currentStep === 1 && (
              <div className="animate-fade-in">
                <h2 className="text-2xl font-bold mb-6 text-center">Select Token to Invest</h2>
                <div className="grid md:grid-cols-2 gap-4">
                  {tokens.map((token) => (
                    <button
                      key={token.symbol}
                      onClick={() => setFormData({ ...formData, token: token.symbol })}
                      className={`p-6 rounded-xl border-2 transition-all hover:scale-105 ${
                        formData.token === token.symbol
                          ? "border-blue-500 bg-blue-500/10"
                          : "border-gray-600 hover:border-gray-500"
                      }`}
                    >
                      <div className="flex items-center space-x-4">
                        <token.icon className={`w-12 h-12 ${token.color}`} />
                        <div className="text-left">
                          <div className="text-xl font-bold">{token.symbol}</div>
                          <div className="text-gray-400">{token.name}</div>
                          <div className="text-green-400 font-semibold">${token.price.toLocaleString()}</div>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Step 2: Set Amount */}
            {currentStep === 2 && (
              <div className="animate-fade-in">
                <h2 className="text-2xl font-bold mb-6 text-center">Set Investment Amount</h2>
                <div className="max-w-md mx-auto space-y-6">
                  <div>
                    <label className="block text-sm font-medium mb-2">Total Investment Amount (USDT)</label>
                    <input
                      type="number"
                      min="1"
                      step="0.01"
                      value={formData.totalAmount}
                      onChange={handleAmountChange}
                      className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg focus:border-blue-500 focus:outline-none text-white"
                      placeholder="Enter amount in USDT (minimum 1)"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Investment Period (Months)</label>
                    <select
                      value={formData.maturityMonths}
                      onChange={(e) => setFormData({ ...formData, maturityMonths: e.target.value })}
                      className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg focus:border-blue-500 focus:outline-none text-white"
                    >
                      <option value="6">6 Months</option>
                      <option value="12">12 Months</option>
                      <option value="24">24 Months</option>
                      <option value="36">36 Months</option>
                      <option value="60">60 Months</option>
                    </select>
                  </div>
                  {formData.totalAmount && Number.parseFloat(formData.totalAmount) >= 1 && (
                    <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                      <div className="text-sm text-gray-300">Investment Summary</div>
                      <div className="text-lg font-semibold">
                        Total: ${Number.parseFloat(formData.totalAmount).toLocaleString()} USDT
                      </div>
                      <div className="text-sm text-gray-400">Over {formData.maturityMonths} months</div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Step 3: Choose Frequency */}
            {currentStep === 3 && (
              <div className="animate-fade-in">
                <h2 className="text-2xl font-bold mb-6 text-center">Choose Investment Frequency</h2>
                <div className="max-w-md mx-auto space-y-4">
                  {frequencies.map((freq) => (
                    <button
                      key={freq.value}
                      onClick={() => setFormData({ ...formData, frequency: freq.value })}
                      className={`w-full p-4 rounded-xl border-2 transition-all ${
                        formData.frequency === freq.value
                          ? "border-blue-500 bg-blue-500/10"
                          : "border-gray-600 hover:border-gray-500"
                      }`}
                    >
                      <div className="text-lg font-semibold">{freq.label}</div>
                      {formData.totalAmount && formData.frequency === freq.value && (
                        <div className="text-sm text-gray-400 mt-1">
                          ~$
                          {calculateIntervalAmount(
                            Number.parseFloat(formData.totalAmount),
                            freq.value,
                            Number.parseInt(formData.maturityMonths),
                          ).toFixed(2)}{" "}
                          per {freq.label.toLowerCase()}
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Step 4: Investment Summary */}
            {currentStep === 4 && (
              <div className="animate-fade-in">
                <h2 className="text-2xl font-bold mb-2 text-center">Investment Summary</h2>
                <p className="text-gray-400 text-center mb-8">
                  Review your SIP configuration before creating the investment
                </p>

                <div className="max-w-2xl mx-auto space-y-6">
                  {/* Amount per execution */}
                  <div className="flex items-center justify-between p-4 bg-gray-800/50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <DollarSign className="w-5 h-5 text-gray-400" />
                      <span className="text-gray-300">Amount per execution</span>
                    </div>
                    <div className="text-right">
                      <div className="text-xl font-bold">${intervalAmount.toFixed(2)}</div>
                      <div className="text-sm text-gray-400">USDT</div>
                    </div>
                  </div>

                  {/* Frequency */}
                  <div className="flex items-center justify-between p-4 bg-gray-800/50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <Clock className="w-5 h-5 text-gray-400" />
                      <span className="text-gray-300">Frequency</span>
                    </div>
                    <div className="text-right">
                      <div className="text-xl font-bold">
                        {formData.frequency.charAt(0).toUpperCase() + formData.frequency.slice(1)}
                      </div>
                      <div className="text-sm text-gray-400">
                        ~${intervalAmount.toFixed(2)}/{formData.frequency}
                      </div>
                    </div>
                  </div>

                  {/* Token Allocation */}
                  <div className="p-4 bg-gray-800/50 rounded-lg">
                    <div className="flex items-center space-x-3 mb-3">
                      <Coins className="w-5 h-5 text-gray-400" />
                      <span className="text-gray-300">Token Allocation</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        {selectedToken && <selectedToken.icon className={`w-8 h-8 ${selectedToken.color}`} />}
                        <div>
                          <div className="font-bold">{formData.token}</div>
                          <div className="text-sm text-gray-400">{selectedToken?.name}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-xl font-bold">${intervalAmount.toFixed(2)}</div>
                        <div className="text-sm text-gray-400">100%</div>
                      </div>
                    </div>
                  </div>

                  {/* Estimated gas fee */}
                  <div className="flex items-center justify-between p-4 bg-gray-800/50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <Zap className="w-5 h-5 text-gray-400" />
                      <span className="text-gray-300">Estimated gas fee</span>
                    </div>
                    <div className="text-right">
                      <div className="text-xl font-bold">{gasFee.toFixed(6)} BNB</div>
                      <div className="text-sm text-gray-400">~$2.21</div>
                    </div>
                  </div>

                  {/* Total per execution */}
                  <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <TrendingUp className="w-5 h-5 text-blue-400" />
                        <span className="text-blue-400">Total per execution</span>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-blue-400">
                          ${(intervalAmount + gasFee * 315).toFixed(2)}
                        </div>
                        <div className="text-sm text-blue-300">Investment + Gas fees</div>
                      </div>
                    </div>
                  </div>

                  {/* Smart Investment Strategy */}
                  <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                        <span className="text-white text-sm">💡</span>
                      </div>
                      <span className="text-green-400 font-semibold">Smart Investment Strategy</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Navigation Buttons */}
          <div className="flex justify-between">
            <button
              onClick={handleBack}
              disabled={currentStep === 1}
              className={`flex items-center space-x-2 px-6 py-3 rounded-lg transition-all ${
                currentStep === 1
                  ? "bg-gray-700 text-gray-500 cursor-not-allowed"
                  : "bg-gray-700 hover:bg-gray-600 text-white"
              }`}
            >
              <ArrowLeft size={20} />
              <span>Back</span>
            </button>

            <button
              onClick={handleNext}
              disabled={
                (currentStep === 1 && !formData.token) ||
                (currentStep === 2 && (!formData.totalAmount || Number.parseFloat(formData.totalAmount) < 1)) ||
                (currentStep === 3 && !formData.frequency)
              }
              className={`flex items-center space-x-2 px-6 py-3 rounded-lg transition-all ${
                (currentStep === 1 && !formData.token) ||
                (currentStep === 2 && (!formData.totalAmount || Number.parseFloat(formData.totalAmount) < 1)) ||
                (currentStep === 3 && !formData.frequency)
                  ? "bg-gray-700 text-gray-500 cursor-not-allowed"
                  : "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white glow-effect"
              }`}
            >
              <span>{currentStep === 4 ? "Review & Confirm" : "Next"}</span>
              <ArrowRight size={20} />
            </button>
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-[#1a2332] rounded-2xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">Confirm SIP Creation</h3>
                  <p className="text-gray-400 text-sm">Review and confirm your investment plan</p>
                </div>
              </div>
              <button
                onClick={() => setShowConfirmModal(false)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            {/* Investment Details */}
            <div className="space-y-4 mb-6">
              <div className="bg-gray-800/50 rounded-lg p-4">
                <div className="flex items-center space-x-3 mb-3">
                  <div className="w-6 h-6 bg-gray-600 rounded flex items-center justify-center">
                    <span className="text-white text-sm">📄</span>
                  </div>
                  <h4 className="font-semibold text-white">Investment Details</h4>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-gray-400 text-sm">Investment Amount</div>
                    <div className="font-bold text-white">
                      ${Number.parseFloat(formData.totalAmount).toFixed(2)} USDT
                    </div>
                  </div>
                  <div>
                    <div className="text-gray-400 text-sm">Frequency</div>
                    <div className="font-bold text-white">
                      {formData.frequency.charAt(0).toUpperCase() + formData.frequency.slice(1)}
                    </div>
                  </div>
                </div>
              </div>

              {/* Token Allocation */}
              <div className="bg-gray-800/50 rounded-lg p-4">
                <div className="flex items-center space-x-3 mb-3">
                  <Clock className="w-6 h-6 text-gray-400" />
                  <h4 className="font-semibold text-white">Token Allocation</h4>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    {selectedToken && <selectedToken.icon className={`w-8 h-8 ${selectedToken.color}`} />}
                    <div>
                      <div className="font-bold text-white">{formData.token}</div>
                      <div className="text-sm text-gray-400">{selectedToken?.name}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-white">${intervalAmount.toFixed(2)}</div>
                    <div className="text-sm text-gray-400">100%</div>
                  </div>
                </div>
              </div>

              {/* Important Notice */}
              <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4">
                <div className="flex items-center space-x-3 mb-3">
                  <AlertTriangle className="w-6 h-6 text-yellow-400" />
                  <h4 className="font-semibold text-yellow-400">Important Notice</h4>
                </div>
                <ul className="text-sm text-gray-300 space-y-1">
                  <li>• This SIP will automatically execute at the specified frequency</li>
                  <li>• Ensure sufficient USDT balance for each execution</li>
                  <li>• Gas fees will be deducted from your BNB balance</li>
                  <li>• You can pause or cancel this SIP anytime from your profile</li>
                </ul>
              </div>

              {/* Terms Agreement */}
              <div className="flex items-start space-x-3">
                <input
                  type="checkbox"
                  id="terms"
                  checked={termsAccepted}
                  onChange={(e) => setTermsAccepted(e.target.checked)}
                  className="mt-1 w-4 h-4 text-blue-600 bg-gray-700 border-gray-600 rounded focus:ring-blue-500"
                />
                <label htmlFor="terms" className="text-sm text-gray-300">
                  I understand the risks involved in cryptocurrency investments and agree to the{" "}
                  <span className="text-blue-400 hover:underline cursor-pointer">Terms of Service</span> and{" "}
                  <span className="text-blue-400 hover:underline cursor-pointer">Privacy Policy</span>
                </label>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="flex space-x-4">
              <button
                onClick={() => setShowConfirmModal(false)}
                className="flex-1 px-6 py-3 bg-gray-700 hover:bg-gray-600 rounded-lg transition-all text-white font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                disabled={isSubmitting || !termsAccepted}
                className={`flex-1 px-6 py-3 rounded-lg transition-all font-semibold ${
                  isSubmitting || !termsAccepted
                    ? "bg-gray-700 text-gray-500 cursor-not-allowed"
                    : "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white glow-effect"
                }`}
              >
                <div className="flex items-center justify-center space-x-2">
                  <Check size={20} />
                  <span>{isSubmitting ? "Creating..." : "Create SIP Investment"}</span>
                </div>
              </button>
            </div>

            {errors.length > 0 && (
              <div className="mt-4 p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
                <div className="text-red-400 font-semibold mb-2">Validation Errors:</div>
                <ul className="text-sm text-red-300 space-y-1">
                  {errors.map((error, index) => (
                    <li key={index}>• {error}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
