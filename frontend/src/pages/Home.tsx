import { Hero } from '@/components/home/Hero'
import { BrandPartners } from '@/components/home/BrandPartners'
import { CategoryGrid } from '@/components/home/CategoryGrid'
import { BookRail } from '@/components/home/BookRail'
import { FlashSale } from '@/components/home/FlashSale'
import { WhyChooseUs } from '@/components/home/WhyChooseUs'
import { Testimonials } from '@/components/home/Testimonials'
import { BlogSection } from '@/components/home/BlogSection'
import { Newsletter } from '@/components/home/Newsletter'
import { useBooks } from '@/hooks/useBooks'
import { withFeaturedFirst } from '@/lib/catalogHelpers'
import { useLanguage } from '@/context/LanguageContext'

export function Home() {
  const { t } = useLanguage()
  const { books: bestsellers } = useBooks({ filter: 'bestsellers', pageSize: 8 })
  const { books: trending } = useBooks({ filter: 'trending', pageSize: 8 })
  const { books: newArrivals } = useBooks({ filter: 'new', pageSize: 8 })

  return (
    <>
      <Hero />
      <BrandPartners />
      <CategoryGrid />
      <BookRail
        eyebrow={t('bestsellersEyebrow')}
        title={t('bestsellersTitle')}
        subtitle={t('bestsellersSubtitle')}
        books={withFeaturedFirst(bestsellers)}
        ctaTo="/shop?filter=bestsellers"
      />
      <FlashSale />
      <BookRail
        eyebrow={t('trendingEyebrow')}
        title={t('trendingTitle')}
        subtitle={t('trendingSubtitle')}
        books={withFeaturedFirst(trending)}
        ctaTo="/shop?filter=trending"
      />
      <WhyChooseUs />
      <BookRail
        eyebrow={t('newArrivalsEyebrow')}
        title={t('newArrivalsTitle')}
        subtitle={t('newArrivalsSubtitle')}
        books={withFeaturedFirst(newArrivals)}
        ctaTo="/shop?filter=new"
      />
      <Testimonials />
      <BlogSection />
      <Newsletter />
    </>
  )
}
