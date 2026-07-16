import { useState } from 'react'
import { motion } from 'framer-motion'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Mail, Lock } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { useLanguage } from '@/context/LanguageContext'
import { useAuth } from '@/context/AuthContext'
import { login as apiLogin, signup as apiSignup, ApiError } from '@/lib/api'

export function Login() {
  const { t } = useLanguage()
  const { login: setSession } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const redirectTo = (location.state as { from?: string } | null)?.from ?? '/account'

  const [mode, setMode] = useState<'login' | 'signup'>('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    if (!/^\S+@\S+\.\S+$/.test(email)) {
      setError(t('emailAddress'))
      return
    }
    if (password.length < 8) {
      setError(t('passwordTooShort'))
      return
    }
    setIsSubmitting(true)
    try {
      const { token, user } = mode === 'login' ? await apiLogin(email, password) : await apiSignup(email, password, name || undefined)
      setSession(token, user)
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
            <Lock size={22} />
          </div>
        </div>

        <h1 className="text-center font-heading text-xl font-bold text-ink">
          {mode === 'login' ? t('loginTitle') : t('signupTitle')}
        </h1>
        <p className="mt-2 text-center text-sm text-ink-muted">
          {mode === 'login' ? t('loginPasswordPrompt') : t('signupPrompt')}
        </p>

        <form onSubmit={handleSubmit}>
          {mode === 'signup' && (
            <>
              <label className="mt-6 block text-xs font-semibold text-ink-soft">{t('fullNameField')}</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={t('fullNameField')}
                className="mt-2 w-full rounded-xl border border-ink/10 px-4 py-3 text-sm outline-none focus:border-primary"
              />
            </>
          )}

          <label className="mt-6 block text-xs font-semibold text-ink-soft">{t('emailAddress')}</label>
          <div className="relative mt-2">
            <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-ink-muted" />
            <input
              type="email"
              autoFocus
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={t('emailPlaceholder')}
              className="w-full rounded-xl border border-ink/10 py-3 pl-11 pr-4 text-sm outline-none focus:border-primary"
            />
          </div>

          <label className="mt-4 block text-xs font-semibold text-ink-soft">{t('passwordField')}</label>
          <div className="relative mt-2">
            <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-ink-muted" />
            <input
              type="password"
              autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder={t('passwordField')}
              className="w-full rounded-xl border border-ink/10 py-3 pl-11 pr-4 text-sm outline-none focus:border-primary"
            />
          </div>

          {error && <p className="mt-3 text-sm text-danger">{error}</p>}

          <Button type="submit" size="lg" disabled={isSubmitting} className="mt-6 w-full justify-center">
            {isSubmitting ? t('signingIn') : mode === 'login' ? t('signIn') : t('createAccount')}
          </Button>
        </form>

        <button
          type="button"
          onClick={() => {
            setMode((m) => (m === 'login' ? 'signup' : 'login'))
            setError(null)
          }}
          className="mt-4 w-full text-center text-sm font-semibold text-primary"
        >
          {mode === 'login' ? t('needAccount') : t('haveAccount')}
        </button>

        <p className="mt-6 text-center text-xs text-ink-muted">
          <Link to="/" className="hover:text-primary">
            {t('navHome')}
          </Link>
        </p>
      </motion.div>
    </div>
  )
}
