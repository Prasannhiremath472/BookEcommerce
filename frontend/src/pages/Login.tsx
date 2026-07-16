import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Mail, ShieldCheck, ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { useLanguage } from '@/context/LanguageContext'
import { useAuth } from '@/context/AuthContext'
import { sendOtp, verifyOtp, ApiError } from '@/lib/api'

const RESEND_COOLDOWN = 60

export function Login() {
  const { t } = useLanguage()
  const { login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const redirectTo = (location.state as { from?: string } | null)?.from ?? '/account'

  const [step, setStep] = useState<'email' | 'otp'>('email')
  const [email, setEmail] = useState('')
  const [code, setCode] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [cooldown, setCooldown] = useState(0)
  const codeInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (cooldown <= 0) return
    const id = setInterval(() => setCooldown((c) => Math.max(0, c - 1)), 1000)
    return () => clearInterval(id)
  }, [cooldown])

  useEffect(() => {
    if (step === 'otp') codeInputRef.current?.focus()
  }, [step])

  const requestOtp = async (e?: React.FormEvent) => {
    e?.preventDefault()
    setError(null)
    if (!/^\S+@\S+\.\S+$/.test(email)) {
      setError(t('emailAddress'))
      return
    }
    setIsSubmitting(true)
    try {
      await sendOtp(email)
      setStep('otp')
      setCode('')
      setCooldown(RESEND_COOLDOWN)
    } catch (err) {
      setError(err instanceof ApiError ? err.message : t('loginRequired'))
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setIsSubmitting(true)
    try {
      const { token, user } = await verifyOtp(email, code)
      login(token, user)
      navigate(redirectTo, { replace: true })
    } catch (err) {
      setError(err instanceof ApiError ? err.message : t('loginRequired'))
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="flex min-h-[80vh] items-center justify-center bg-surface px-4 pb-16 pt-32">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md rounded-2xl border border-ink/8 bg-white p-8 shadow-soft"
      >
        <div className="mb-6 flex items-center justify-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary-50 text-primary">
            {step === 'email' ? <Mail size={22} /> : <ShieldCheck size={22} />}
          </div>
        </div>

        {step === 'email' ? (
          <form onSubmit={requestOtp}>
            <h1 className="text-center font-heading text-xl font-bold text-ink">{t('loginTitle')}</h1>
            <p className="mt-2 text-center text-sm text-ink-muted">{t('loginEmailPrompt')}</p>

            <label className="mt-6 block text-xs font-semibold text-ink-soft">{t('emailAddress')}</label>
            <input
              type="email"
              autoFocus
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={t('emailPlaceholder')}
              className="mt-2 w-full rounded-xl border border-ink/10 px-4 py-3 text-sm outline-none focus:border-primary"
            />

            {error && <p className="mt-3 text-sm text-danger">{error}</p>}

            <Button type="submit" size="lg" disabled={isSubmitting} className="mt-6 w-full justify-center">
              {isSubmitting ? t('sendingOtp') : t('sendOtp')}
            </Button>
          </form>
        ) : (
          <form onSubmit={handleVerify}>
            <button
              type="button"
              onClick={() => setStep('email')}
              className="mb-4 flex items-center gap-1 text-xs font-semibold text-ink-muted hover:text-primary"
            >
              <ArrowLeft size={14} /> {t('changeEmail')}
            </button>

            <h1 className="text-center font-heading text-xl font-bold text-ink">{t('enterOtp')}</h1>
            <p className="mt-2 text-center text-sm text-ink-muted">
              {t('otpSentTo')} <span className="font-semibold text-ink">{email}</span>
            </p>

            <input
              ref={codeInputRef}
              type="text"
              inputMode="numeric"
              autoComplete="one-time-code"
              maxLength={6}
              value={code}
              onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))}
              placeholder="••••••"
              className="mt-6 w-full rounded-xl border border-ink/10 px-4 py-3 text-center text-2xl tracking-[0.5em] outline-none focus:border-primary"
            />

            {error && <p className="mt-3 text-sm text-danger">{error}</p>}

            <Button type="submit" size="lg" disabled={isSubmitting || code.length < 4} className="mt-6 w-full justify-center">
              {isSubmitting ? t('verifyingOtp') : t('verifyOtp')}
            </Button>

            <button
              type="button"
              onClick={() => requestOtp()}
              disabled={cooldown > 0 || isSubmitting}
              className="mt-4 w-full text-center text-sm font-semibold text-primary disabled:text-ink-muted"
            >
              {cooldown > 0 ? `${t('resendOtpIn')} ${cooldown}${t('seconds')}` : t('resendOtp')}
            </button>
          </form>
        )}

        <p className="mt-6 text-center text-xs text-ink-muted">
          <Link to="/" className="hover:text-primary">
            {t('navHome')}
          </Link>
        </p>
      </motion.div>
    </div>
  )
}
