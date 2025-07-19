"use client"

import Link from "next/link"
import { useWallet } from "@/contexts/WalletContext"
import { Wallet, Menu, X } from "lucide-react"
import { useState } from "react"

export default function Navbar() {
  const { account, isConnected, connectWallet, disconnectWallet } = useWallet()
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`
  }

  return (
    <nav className="fixed top-0 w-full z-50 bg-[#0e1324]/90 backdrop-blur-md border-b border-blue-500/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">OS</span>
            </div>
            <span className="text-xl font-bold gradient-text">Onchain SIP</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link href="/" className="text-gray-300 hover:text-white transition-colors">
              Home
            </Link>
            <Link href="/invest" className="text-gray-300 hover:text-white transition-colors">
              Invest
            </Link>
            <Link href="/profile" className="text-gray-300 hover:text-white transition-colors">
              Profile
            </Link>
          </div>

          {/* Wallet Connection */}
          <div className="hidden md:block">
            {isConnected ? (
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-300">{formatAddress(account!)}</span>
                <button
                  onClick={disconnectWallet}
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg transition-colors"
                >
                  Disconnect
                </button>
              </div>
            ) : (
              <button
                onClick={connectWallet}
                className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 rounded-lg transition-all glow-effect"
              >
                <Wallet size={20} />
                <span>Connect Wallet</span>
              </button>
            )}
          </div>

          {/* Mobile menu button */}
          <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="md:hidden p-2">
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 space-y-4">
            <Link href="/" className="block text-gray-300 hover:text-white transition-colors">
              Home
            </Link>
            <Link href="/invest" className="block text-gray-300 hover:text-white transition-colors">
              Invest
            </Link>
            <Link href="/profile" className="block text-gray-300 hover:text-white transition-colors">
              Profile
            </Link>
            <div className="pt-4 border-t border-gray-700">
              {isConnected ? (
                <div className="space-y-2">
                  <div className="text-sm text-gray-300">{formatAddress(account!)}</div>
                  <button
                    onClick={disconnectWallet}
                    className="w-full px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg transition-colors"
                  >
                    Disconnect
                  </button>
                </div>
              ) : (
                <button
                  onClick={connectWallet}
                  className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 rounded-lg transition-all"
                >
                  <Wallet size={20} />
                  <span>Connect Wallet</span>
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
