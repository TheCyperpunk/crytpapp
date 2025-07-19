"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Navbar from "@/components/Navbar"
import { useSIP } from "@/contexts/SIPContext"
import { useWallet } from "@/contexts/WalletContext"
import { validateSIPPlan, calculateIntervalAmount, estimateGasFee } from "@/utils/sipCalculator"
import { ArrowLeft, ArrowRight, Bitcoin, EclipseIcon as Ethereum, BanknoteIcon as BNB, DollarSign } from "lucide-react"

const tokens = [
  { symbol: "BTC", name: "Bitcoin", price: 42350, icon: Bitcoin, color: "text-orange-400" },
  { symbol: "ETH", name: "Ethereum", price: 2580, icon: Ethereum, color: "text-blue-400" },
  { symbol: "BNB", name: "BNB Chain", price: 315, icon: BNB, color: "text-yellow-400" },
  { symbol: "SOL", name: "Solana", price: 98, icon: DollarSign, color: "text-purple-400" },
]

const frequencies = [
  { value: "daily", label: "Daily" },
  { value: "weekly", label: "Weekly" },
  { value: "monthly", label: "Monthly" },
  { value: "custom", label: "Custom" },
]

export default function InvestPage() {
  const router = useRouter()
  const { createPlan } = useSIP()
  const { isConnected } = useWallet()
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState({
    token: "",
    totalAmount: "",
    frequency: "",
    maturityMonths: "12",
    customDays: "",
  })
  const [errors, setErrors] = useState<string[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleNext = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleSubmit = async () => {
    if (!isConnected) {
      alert("Please connect your wallet first")
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

      router.push("/dashboard")
    } catch (error) {
      console.error("Failed to create SIP:", error)
    } finally {
      setIsSubmitting(false)
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
              <span>Confirm</span>
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
                      value={formData.totalAmount}
                      onChange={(e) => setFormData({ ...formData, totalAmount: e.target.value })}
                      className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg focus:border-blue-500 focus:outline-none text-white"
                      placeholder="Enter amount in USDT"
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
                  {formData.totalAmount && (
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

                  {formData.frequency === "custom" && (
                    <input
                      type="number"
                      value={formData.customDays}
                      onChange={(e) => setFormData({ ...formData, customDays: e.target.value })}
                      className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg focus:border-blue-500 focus:outline-none text-white"
                      placeholder="Enter custom interval in days"
                    />
                  )}
                </div>
              </div>
            )}

            {/* Step 4: Confirm */}
            {currentStep === 4 && (
              <div className="animate-fade-in">
                <h2 className="text-2xl font-bold mb-6 text-center">Confirm Your SIP</h2>
                <div className="max-w-md mx-auto space-y-6">
                  <div className="card-glow rounded-xl p-6">
                    <h3 className="text-lg font-semibold mb-4">Investment Summary</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Token:</span>
                        <span className="font-semibold">{formData.token}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Total Amount:</span>
                        <span className="font-semibold">
                          ${Number.parseFloat(formData.totalAmount).toLocaleString()} USDT
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Frequency:</span>
                        <span className="font-semibold">{formData.frequency}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Amount per interval:</span>
                        <span className="font-semibold">${intervalAmount.toFixed(2)} USDT</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Duration:</span>
                        <span className="font-semibold">{formData.maturityMonths} months</span>
                      </div>
                      <div className="border-t border-gray-600 pt-3">
                        <div className="flex justify-between">
                          <span className="text-gray-400">Estimated Gas Fee:</span>
                          <span className="font-semibold">{gasFee} BNB</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {errors.length > 0 && (
                    <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
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

            {currentStep < 4 ? (
              <button
                onClick={handleNext}
                disabled={
                  (currentStep === 1 && !formData.token) ||
                  (currentStep === 2 && !formData.totalAmount) ||
                  (currentStep === 3 && !formData.frequency)
                }
                className={`flex items-center space-x-2 px-6 py-3 rounded-lg transition-all ${
                  (currentStep === 1 && !formData.token) ||
                  (currentStep === 2 && !formData.totalAmount) ||
                  (currentStep === 3 && !formData.frequency)
                    ? "bg-gray-700 text-gray-500 cursor-not-allowed"
                    : "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white glow-effect"
                }`}
              >
                <span>Next</span>
                <ArrowRight size={20} />
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={isSubmitting || !isConnected}
                className={`flex items-center space-x-2 px-6 py-3 rounded-lg transition-all ${
                  isSubmitting || !isConnected
                    ? "bg-gray-700 text-gray-500 cursor-not-allowed"
                    : "bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white glow-effect"
                }`}
              >
                <span>{isSubmitting ? "Creating..." : "Create SIP"}</span>
                {!isSubmitting && <ArrowRight size={20} />}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
