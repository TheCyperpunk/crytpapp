// SIP Validation and Calculation Utilities

export const FREQUENCY_OPTIONS = [
  { value: "daily", label: "Daily", days: 1 },
  { value: "weekly", label: "Weekly", days: 7 },
  { value: "monthly", label: "Monthly", days: 30 },
  { value: "custom", label: "Custom", days: null },
]

export const MATURITY_TERMS = {
  min: 6, // months
  max: 60, // months
}

export const MIN_TOTAL_INVESTMENT = 100 // USDT

export function validateSIPPlan(planData) {
  const errors = []

  // Validate minimum investment
  if (planData.totalAmount < MIN_TOTAL_INVESTMENT) {
    errors.push(`Minimum total investment is $${MIN_TOTAL_INVESTMENT}`)
  }

  // Validate maturity term
  if (planData.maturityMonths < MATURITY_TERMS.min || planData.maturityMonths > MATURITY_TERMS.max) {
    errors.push(`Maturity term must be between ${MATURITY_TERMS.min} and ${MATURITY_TERMS.max} months`)
  }

  // Validate frequency
  const validFrequencies = FREQUENCY_OPTIONS.map((f) => f.value)
  if (!validFrequencies.includes(planData.frequency)) {
    errors.push("Invalid frequency selected")
  }

  return {
    isValid: errors.length === 0,
    errors,
  }
}

export function calculateIntervalAmount(totalAmount, frequency, maturityMonths) {
  const frequencyDays = FREQUENCY_OPTIONS.find((f) => f.value === frequency)?.days || 30
  const totalDays = maturityMonths * 30
  const intervals = Math.floor(totalDays / frequencyDays)

  return totalAmount / intervals
}

export function estimateGasFee(operation) {
  // Mock gas estimation
  const gasEstimates = {
    createPlan: 0.002,
    executeSIP: 0.001,
    finalizeSIP: 0.0015,
  }

  return gasEstimates[operation] || 0.001
}
