import { Link } from 'react-router-dom'
import { Facebook, Instagram, Twitter, Youtube, Mail, MapPin, Phone } from 'lucide-react'
import { useLanguage } from '@/context/LanguageContext'

export function Footer() {
  const { t } = useLanguage()

  const columns = [
    {
      title: t('footerShop'),
      links: [
        { label: t('navBestsellers'), to: '/shop?filter=bestsellers' },
        { label: t('navNewArrivals'), to: '/shop?filter=new' },
        { label: t('navDeals'), to: '/shop?filter=deals' },
      ],
    },
    {
      title: t('footerCompany'),
      links: [{ label: t('footerAbout'), to: '/about' }],
    },
    {
      title: t('footerSupport'),
      links: [
        { label: t('footerTrackOrder'), to: '/account/orders' },
        { label: t('footerContact'), to: 'mailto:rhlraje007@gmail.com' },
      ],
    },
  ]

  return (
    <footer className="relative overflow-hidden bg-gradient-dark text-white">
      <div className="pointer-events-none absolute -right-32 -top-32 h-96 w-96 rounded-full bg-primary/20 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-32 -left-32 h-96 w-96 rounded-full bg-secondary/20 blur-3xl" />

      <div className="container-app relative py-16">
        <div className="grid gap-12 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div>
            <Link to="/" className="flex items-center gap-2.5 font-heading text-2xl font-bold text-white">
              <img src="/brand/logo.jpeg" alt={t('brandName')} className="h-11 w-11 rounded-full object-cover" />
              {t('brandName')}
            </Link>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-white/60">
              {t('footerTagline')}
            </p>
            <div className="mt-6 flex flex-col gap-2.5 text-sm text-white/60">
              <div className="flex items-center gap-2">
                <MapPin size={15} /> {t('footerAddress')}
              </div>
              <div className="flex items-center gap-2">
                <Phone size={15} /> +91 90282 90713
              </div>
              <div className="flex items-center gap-2">
                <Mail size={15} /> rhlraje007@gmail.com
              </div>
            </div>
            <div className="mt-6 flex gap-3">
              {[Facebook, Instagram, Twitter, Youtube].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 transition-colors hover:bg-primary"
                >
                  <Icon size={15} />
                </a>
              ))}
            </div>
          </div>

          {columns.map((col) => (
            <div key={col.title}>
              <h4 className="mb-4 font-heading text-sm font-semibold uppercase tracking-wide text-white/90">{col.title}</h4>
              <ul className="flex flex-col gap-2.5">
                {col.links.map((l) =>
                  l.to.startsWith('mailto:') ? (
                    <li key={l.label}>
                      <a href={l.to} className="text-sm text-white/60 transition-colors hover:text-white">
                        {l.label}
                      </a>
                    </li>
                  ) : (
                    <li key={l.label}>
                      <Link to={l.to} className="text-sm text-white/60 transition-colors hover:text-white">
                        {l.label}
                      </Link>
                    </li>
                  ),
                )}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-16 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-8 sm:flex-row">
          <p className="text-xs text-white/50">{t('footerCopyright')}</p>
        </div>
      </div>
    </footer>
  )
}
