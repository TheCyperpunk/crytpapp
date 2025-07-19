"use client"

import { useEffect, useRef } from "react"

export default function PortfolioChart() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas size
    canvas.width = canvas.offsetWidth * window.devicePixelRatio
    canvas.height = canvas.offsetHeight * window.devicePixelRatio
    ctx.scale(window.devicePixelRatio, window.devicePixelRatio)

    // Mock data for portfolio growth
    const data = [
      { month: 0, value: 0 },
      { month: 1, value: 100 },
      { month: 2, value: 250 },
      { month: 3, value: 420 },
      { month: 4, value: 650 },
      { month: 5, value: 900 },
      { month: 6, value: 1200 },
      { month: 7, value: 1580 },
      { month: 8, value: 2000 },
      { month: 9, value: 2450 },
      { month: 10, value: 2950 },
      { month: 11, value: 3500 },
      { month: 12, value: 4200 },
    ]

    const width = canvas.offsetWidth
    const height = canvas.offsetHeight
    const padding = 40

    // Clear canvas
    ctx.clearRect(0, 0, width, height)

    // Create gradient
    const gradient = ctx.createLinearGradient(0, 0, 0, height)
    gradient.addColorStop(0, "rgba(59, 130, 246, 0.3)")
    gradient.addColorStop(1, "rgba(59, 130, 246, 0.05)")

    // Draw area under curve
    ctx.beginPath()
    ctx.moveTo(padding, height - padding)

    data.forEach((point, index) => {
      const x = padding + (point.month / 12) * (width - 2 * padding)
      const y = height - padding - (point.value / 4200) * (height - 2 * padding)

      if (index === 0) {
        ctx.lineTo(x, y)
      } else {
        ctx.lineTo(x, y)
      }
    })

    ctx.lineTo(width - padding, height - padding)
    ctx.closePath()
    ctx.fillStyle = gradient
    ctx.fill()

    // Draw line
    ctx.beginPath()
    ctx.strokeStyle = "#3b82f6"
    ctx.lineWidth = 3

    data.forEach((point, index) => {
      const x = padding + (point.month / 12) * (width - 2 * padding)
      const y = height - padding - (point.value / 4200) * (height - 2 * padding)

      if (index === 0) {
        ctx.moveTo(x, y)
      } else {
        ctx.lineTo(x, y)
      }
    })

    ctx.stroke()

    // Draw points
    data.forEach((point) => {
      const x = padding + (point.month / 12) * (width - 2 * padding)
      const y = height - padding - (point.value / 4200) * (height - 2 * padding)

      ctx.beginPath()
      ctx.arc(x, y, 4, 0, 2 * Math.PI)
      ctx.fillStyle = "#3b82f6"
      ctx.fill()
      ctx.strokeStyle = "#1e40af"
      ctx.lineWidth = 2
      ctx.stroke()
    })
  }, [])

  return (
    <div className="w-full h-64 bg-gradient-to-br from-slate-900/50 to-slate-800/50 rounded-xl p-4 card-glow">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-white">Portfolio Growth Simulation</h3>
        <div className="text-right">
          <div className="text-2xl font-bold text-green-400">$4,200</div>
          <div className="text-sm text-gray-400">+320% ROI</div>
        </div>
      </div>
      <canvas ref={canvasRef} className="w-full h-40" style={{ width: "100%", height: "160px" }} />
    </div>
  )
}
