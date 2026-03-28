import crypto from 'crypto'

const ALGORITHM = 'aes-256-cbc'

function getKey(): Buffer {
  return crypto.scryptSync(process.env.TRON_ENCRYPTION_SECRET!, 'keystone-salt', 32)
}

export function encryptPrivateKey(privateKey: string): string {
  const iv        = crypto.randomBytes(16)
  const cipher    = crypto.createCipheriv(ALGORITHM, getKey(), iv)
  const encrypted = Buffer.concat([cipher.update(privateKey, 'utf8'), cipher.final()])
  return iv.toString('hex') + ':' + encrypted.toString('hex')
}

export function decryptPrivateKey(encrypted: string): string {
  const [ivHex, encHex] = encrypted.split(':')
  const iv        = Buffer.from(ivHex, 'hex')
  const encBuf    = Buffer.from(encHex, 'hex')
  const decipher  = crypto.createDecipheriv(ALGORITHM, getKey(), iv)
  const decrypted = Buffer.concat([decipher.update(encBuf), decipher.final()])
  return decrypted.toString('utf8')
}