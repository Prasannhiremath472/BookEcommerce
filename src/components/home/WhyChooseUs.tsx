import { motion } from 'framer-motion'
import { Truck, ShieldCheck, RotateCcw, Headphones } from 'lucide-react'

const perks = [
  { icon: Truck, title: 'Free Fast Shipping', desc: 'Free delivery on orders over ₹500, arriving in 2-3 days.' },
  { icon: ShieldCheck, title: 'Secure Payments', desc: 'Bank-level encryption on every transaction, every time.' },
  { icon: RotateCcw, title: 'Easy 30-Day Returns', desc: 'Not the right fit? Return it hassle-free within 30 days.' },
  { icon: Headphones, title: '24/7 Support', desc: 'Our book experts are here around the clock to help.' },
]

export function WhyChooseUs() {
  return (
    <section className="container-app py-16 sm:py-20">
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {perks.map((p, i) => (
          <motion.div
            key={p.title}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.5, delay: i * 0.08 }}
            className="group rounded-2xl border border-ink/5 bg-white p-7 shadow-soft transition-shadow hover:shadow-card"
          >
            <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-primary text-white transition-transform group-hover:scale-110">
              <p.icon size={22} />
            </div>
            <h3 className="font-heading text-lg font-semibold text-ink">{p.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-ink-muted">{p.desc}</p>
          </motion.div>
        ))}
      </div>
    </section>
  )
}
