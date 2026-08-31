import assert from 'node:assert/strict'
import test from 'node:test'
import {
  atomicToDecimalString,
  decimalToAtomicUnits,
  formatDecimalAmount,
  parseAtomicUnits,
} from '../lib/tron/amounts.ts'

test('converts atomic USDT amounts exactly', () => {
  assert.equal(atomicToDecimalString(1n), '0.000001')
  assert.equal(atomicToDecimalString(1_234_567n), '1.234567')
  assert.equal(atomicToDecimalString(9_007_199_254_740_993n), '9007199254.740993')
})

test('converts decimal USDT amounts exactly', () => {
  assert.equal(decimalToAtomicUnits('0.000001'), 1n)
  assert.equal(decimalToAtomicUnits('10.25'), 10_250_000n)
  assert.throws(() => decimalToAtomicUnits('1.0000001'))
  assert.throws(() => decimalToAtomicUnits('-1'))
})

test('rejects unsafe numeric blockchain values', () => {
  assert.equal(parseAtomicUnits('9007199254740993'), 9_007_199_254_740_993n)
  assert.throws(() => parseAtomicUnits(9_007_199_254_740_993))
  assert.throws(() => parseAtomicUnits('1e6'))
})

test('formats display values without floating-point rounding', () => {
  assert.equal(formatDecimalAmount('1.005000'), '1.01')
  assert.equal(formatDecimalAmount('999.999999'), '1000.00')
  assert.equal(formatDecimalAmount('10'), '10.00')
})
