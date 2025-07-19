"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import Navbar from "@/components/Navbar"
import PortfolioChart from "@/components/PortfolioChart"
import { ArrowRight, TrendingUp, Shield, Zap, DollarSign } from "lucide-react"

export default function HomePage() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    setIsVisible(true)
  }, [])

  const features = [
    {
      icon: <TrendingUp className="w-8 h-8 text-blue-400" />,
      title: "Automated Investing",
      description: "Set up systematic investment plans that execute automatically on-chain",
    },
    {
      icon: <Shield className="w-8 h-8 text-green-400" />,
      title: "Secure & Decentralized",
      description: "Your investments are secured by smart contracts on BNB Chain",
    },
    {
      icon: <Zap className="w-8 h-8 text-purple-400" />,
      title: "Low Fees",
      description: "Minimal gas fees and no hidden charges for your investment plans",
    },
    {
      icon: <DollarSign className="w-8 h-8 text-yellow-400" />,
      title: "Multiple Assets",
      description: "Invest in BTC, ETH, BNB, SOL and more with USDT/USDC",
    },
  ]

  return (
    <div className="min-h-screen bg-[#0e1324]">
      <Navbar />

      {/* Hero Section */}
      <section className="pt-24 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className={`text-center transition-all duration-1000 ${isVisible ? "animate-fade-in" : "opacity-0"}`}>
            <h1 className="text-5xl md:text-7xl font-bold mb-6">
              <span className="gradient-text">Onchain SIP</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto">
              Decentralized Systematic Investment Plans on BNB Chain. Automate your crypto investments with smart
              contracts.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link
                href="/invest"
                className="flex items-center space-x-2 px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 rounded-xl transition-all glow-effect text-lg font-semibold"
              >
                <span>Start Investing</span>
                <ArrowRight size={20} />
              </Link>
              <Link
                href="/dashboard"
                className="px-8 py-4 border border-blue-500/50 hover:border-blue-500 rounded-xl transition-all text-lg font-semibold hover:bg-blue-500/10"
              >
                View Dashboard
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Portfolio Chart Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div
            className={`transition-all duration-1000 delay-300 ${isVisible ? "animate-slide-up" : "opacity-0 translate-y-10"}`}
          >
            <PortfolioChart />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div
            className={`text-center mb-16 transition-all duration-1000 delay-500 ${isVisible ? "animate-fade-in" : "opacity-0"}`}
          >
            <h2 className="text-4xl font-bold mb-4 gradient-text">Why Choose Onchain SIP?</h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Experience the future of systematic investing with blockchain technology
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className={`card-glow rounded-xl p-6 text-center hover:scale-105 transition-all duration-300 ${
                  isVisible ? "animate-slide-up" : "opacity-0 translate-y-10"
                }`}
                style={{ animationDelay: `${700 + index * 100}ms` }}
              >
                <div className="flex justify-center mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold mb-3 text-white">{feature.title}</h3>
                <p className="text-gray-400">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <div
            className={`card-glow rounded-2xl p-12 transition-all duration-1000 delay-1000 ${isVisible ? "animate-fade-in" : "opacity-0"}`}
          >
            <h2 className="text-3xl font-bold mb-4 gradient-text">Ready to Start Your Investment Journey?</h2>
            <p className="text-xl text-gray-300 mb-8">
              Join thousands of investors building wealth through systematic crypto investing
            </p>
            <Link
              href="/invest"
              className="inline-flex items-center space-x-2 px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 rounded-xl transition-all glow-effect text-lg font-semibold"
            >
              <span>Create Your First SIP</span>
              <ArrowRight size={20} />
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
