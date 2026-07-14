import mailjetPkg from 'node-mailjet'
import { config } from '../config.js'

const mailjet = new mailjetPkg.Client({
  apiKey: config.mailjet.apiKey,
  apiSecret: config.mailjet.apiSecret,
})

export async function sendOtpEmail(toEmail: string, code: string) {
  const subject = `Your Cosmos Edge login code: ${code}`
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 480px; margin: 0 auto;">
      <h2 style="color: #4C7F2A;">Cosmos Edge</h2>
      <p>Your one-time login code is:</p>
      <p style="font-size: 32px; font-weight: bold; letter-spacing: 8px; color: #0F4E19;">${code}</p>
      <p style="color: #6B7280; font-size: 13px;">
        This code expires in ${config.otp.ttlMinutes} minutes. If you didn't request this, you can ignore this email.
      </p>
    </div>
  `

  return mailjet.post('send', { version: 'v3.1' }).request({
    Messages: [
      {
        From: {
          Email: config.mailjet.senderEmail,
          Name: config.mailjet.senderName,
        },
        To: [{ Email: toEmail }],
        Subject: subject,
        HTMLPart: html,
        TextPart: `Your Cosmos Edge login code is ${code}. It expires in ${config.otp.ttlMinutes} minutes.`,
      },
    ],
  })
}
