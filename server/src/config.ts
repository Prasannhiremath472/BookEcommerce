import 'dotenv/config'

function required(name: string, fallback = ''): string {
  return process.env[name] ?? fallback
}

export const config = {
  port: Number(process.env.PORT ?? 4000),
  corsOrigin: required('CORS_ORIGIN', 'http://localhost:5173'),

  jwtSecret: required('JWT_SECRET', 'dev-secret-change-me'),
  jwtExpiresIn: required('JWT_EXPIRES_IN', '30d'),

  db: {
    host: required('DB_HOST', 'localhost'),
    port: Number(process.env.DB_PORT ?? 3306),
    user: required('DB_USER'),
    password: required('DB_PASSWORD'),
    database: required('DB_NAME'),
  },

  mailjet: {
    apiKey: required('MAILJET_API_KEY'),
    apiSecret: required('MAILJET_API_SECRET'),
    senderEmail: required('MAILJET_SENDER_EMAIL'),
    senderName: required('MAILJET_SENDER_NAME', 'Cosmos Edge'),
  },

  otp: {
    ttlMinutes: Number(process.env.OTP_TTL_MINUTES ?? 10),
    length: Number(process.env.OTP_LENGTH ?? 6),
    maxAttempts: Number(process.env.OTP_MAX_ATTEMPTS ?? 5),
    resendCooldownSeconds: Number(process.env.OTP_RESEND_COOLDOWN_SECONDS ?? 45),
  },
}
