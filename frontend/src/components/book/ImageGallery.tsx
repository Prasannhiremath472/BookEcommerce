import { useState } from 'react'
import { motion } from 'framer-motion'
import clsx from 'clsx'

export function ImageGallery({ images, alt }: { images: string[]; alt: string }) {
  const [active, setActive] = useState(0)
  const [zoomed, setZoomed] = useState(false)
  const [origin, setOrigin] = useState('center center')

  return (
    <div className="flex flex-col gap-4 sm:flex-row">
      {images.length > 1 && (
        <div className="order-2 flex gap-3 sm:order-1 sm:flex-col">
          {images.map((img, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              className={clsx(
                'h-16 w-14 flex-shrink-0 overflow-hidden rounded-lg border-2 transition-colors',
                active === i ? 'border-primary' : 'border-transparent opacity-60 hover:opacity-100',
              )}
            >
              <img src={img} alt="" className="h-full w-full object-cover" />
            </button>
          ))}
        </div>
      )}

      <div
        className="group relative order-1 flex-1 cursor-zoom-in overflow-hidden rounded-2xl bg-ink/5 sm:order-2"
        onMouseMove={(e) => {
          const rect = e.currentTarget.getBoundingClientRect()
          const x = ((e.clientX - rect.left) / rect.width) * 100
          const y = ((e.clientY - rect.top) / rect.height) * 100
          setOrigin(`${x}% ${y}%`)
        }}
        onMouseEnter={() => setZoomed(true)}
        onMouseLeave={() => setZoomed(false)}
      >
        <motion.img
          key={active}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          src={images[active]}
          alt={alt}
          className="aspect-[3/4] w-full object-cover transition-transform duration-300"
          style={{
            transformOrigin: origin,
            transform: zoomed ? 'scale(1.8)' : 'scale(1)',
          }}
        />
      </div>
    </div>
  )
}
