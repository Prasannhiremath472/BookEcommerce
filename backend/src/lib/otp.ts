import crypto from 'crypto'

export function generateOtpCode(length: number): string {
  const digits = '0123456789'
  let code = ''
  for (let i = 0; i < length; i++) {
    code += digits[crypto.randomInt(0, digits.length)]
  }
  return code
}

export function hashOtpCode(code: string): string {
  return crypto.createHash('sha256').update(code).digest('hex')
}
