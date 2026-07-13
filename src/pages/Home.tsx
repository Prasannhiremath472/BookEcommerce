import { Hero } from '@/components/home/Hero'
import { BrandPartners } from '@/components/home/BrandPartners'
import { CategoryGrid } from '@/components/home/CategoryGrid'
import { BookRail } from '@/components/home/BookRail'
import { FlashSale } from '@/components/home/FlashSale'
import { WhyChooseUs } from '@/components/home/WhyChooseUs'
import { FeaturedAuthors } from '@/components/home/FeaturedAuthors'
import { Testimonials } from '@/components/home/Testimonials'
import { BlogSection } from '@/components/home/BlogSection'
import { Newsletter } from '@/components/home/Newsletter'
import { books, getBestsellers, getTrending, getNewArrivals } from '@/data/books'
import { useLanguage } from '@/context/LanguageContext'

export function Home() {
  const { t } = useLanguage()
  return (
    <>
      <Hero />
      <BrandPartners />
      <CategoryGrid />
      <BookRail
        eyebrow={t('bestsellersEyebrow')}
        title={t('bestsellersTitle')}
        subtitle={t('bestsellersSubtitle')}
        books={getBestsellers().length ? getBestsellers() : books.slice(0, 8)}
        ctaTo="/shop?filter=bestsellers"
      />
      <FlashSale />
      <BookRail
        eyebrow={t('trendingEyebrow')}
        title={t('trendingTitle')}
        subtitle={t('trendingSubtitle')}
        books={getTrending().length ? getTrending() : books.slice(2, 10)}
        ctaTo="/shop?filter=trending"
      />
      <WhyChooseUs />
      <BookRail
        eyebrow={t('newArrivalsEyebrow')}
        title={t('newArrivalsTitle')}
        subtitle={t('newArrivalsSubtitle')}
        books={getNewArrivals().length ? getNewArrivals() : books.slice(4, 12)}
        ctaTo="/shop?filter=new"
      />
      <FeaturedAuthors />
      <Testimonials />
      <BlogSection />
      <Newsletter />
    </>
  )
}
