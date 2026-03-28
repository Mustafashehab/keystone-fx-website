// @ts-nocheck
export function createTronClient(privateKey?: string) {
  const TronWebLib = require('tronweb')
  const TronWebConstructor = TronWebLib.TronWeb

  return new TronWebConstructor({
    fullHost: 'https://api.trongrid.io',
    headers:  { 'TRON-PRO-API-KEY': process.env.TRON_GRID_API_KEY },
    ...(privateKey ? { privateKey } : {}),
  })
}