const DECIMAL_INTEGER_PATTERN = /^\d+$/

export const USDT_DECIMALS = 6
export const USDT_ATOMIC_FACTOR = 10n ** BigInt(USDT_DECIMALS)

/**
 * Parse a blockchain integer without passing through JavaScript floating point.
 */
export function parseAtomicUnits(value: unknown): bigint {
  if (typeof value === 'bigint') {
    if (value < 0n) throw new Error('Atomic amount cannot be negative')
    return value
  }

  if (typeof value === 'number') {
    if (!Number.isSafeInteger(value) || value < 0) {
      throw new Error('Numeric atomic amount must be a non-negative safe integer')
    }
    return BigInt(value)
  }

  const normalized = typeof value === 'string'
    ? value
    : value && typeof value === 'object' && 'toString' in value
      ? String(value)
      : ''

  if (!DECIMAL_INTEGER_PATTERN.test(normalized)) {
    throw new Error('Atomic amount must contain decimal digits only')
  }

  return BigInt(normalized)
}

export function atomicToDecimalString(
  atomicValue: bigint,
  decimals = USDT_DECIMALS
): string {
  if (!Number.isInteger(decimals) || decimals < 0 || decimals > 30) {
    throw new Error('Invalid decimal precision')
  }
  if (atomicValue < 0n) throw new Error('Atomic amount cannot be negative')
  if (decimals === 0) return atomicValue.toString()

  const factor = 10n ** BigInt(decimals)
  const whole = atomicValue / factor
  const fraction = (atomicValue % factor).toString().padStart(decimals, '0')
  return `${whole}.${fraction}`
}

export function decimalToAtomicUnits(
  decimalValue: string,
  decimals = USDT_DECIMALS
): bigint {
  if (!Number.isInteger(decimals) || decimals < 0 || decimals > 30) {
    throw new Error('Invalid decimal precision')
  }

  const match = decimalValue.match(/^(\d+)(?:\.(\d+))?$/)
  if (!match) throw new Error('Decimal amount is invalid')

  const fraction = match[2] ?? ''
  if (fraction.length > decimals) {
    throw new Error(`Decimal amount exceeds ${decimals} fractional digits`)
  }

  const factor = 10n ** BigInt(decimals)
  const wholeAtomic = BigInt(match[1]) * factor
  const fractionAtomic = fraction.length === 0
    ? 0n
    : BigInt(fraction.padEnd(decimals, '0'))

  return wholeAtomic + fractionAtomic
}

/**
 * Display-only formatting that rounds a decimal string without Number coercion.
 */
export function formatDecimalAmount(
  decimalValue: string,
  fractionDigits = 2
): string {
  if (!Number.isInteger(fractionDigits) || fractionDigits < 0 || fractionDigits > 20) {
    throw new Error('Invalid display precision')
  }

  const match = decimalValue.match(/^(\d+)(?:\.(\d+))?$/)
  if (!match) return '0'.padEnd(fractionDigits > 0 ? fractionDigits + 2 : 1, '0')

  const whole = match[1]
  const fraction = match[2] ?? ''
  const kept = fraction.slice(0, fractionDigits).padEnd(fractionDigits, '0')
  const nextDigit = fraction[fractionDigits]

  if (!nextDigit || nextDigit < '5') {
    return fractionDigits === 0 ? whole : `${whole}.${kept}`
  }

  const scale = 10n ** BigInt(fractionDigits)
  const rounded = BigInt(whole) * scale + BigInt(kept || '0') + 1n
  const roundedWhole = rounded / scale
  if (fractionDigits === 0) return roundedWhole.toString()
  const roundedFraction = (rounded % scale).toString().padStart(fractionDigits, '0')
  return `${roundedWhole}.${roundedFraction}`
}
