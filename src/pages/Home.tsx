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

export function Home() {
  return (
    <>
      <Hero />
      <BrandPartners />
      <CategoryGrid />
      <BookRail
        eyebrow="Handpicked"
        title="Bestsellers"
        subtitle="The titles everyone's talking about right now."
        books={getBestsellers().length ? getBestsellers() : books.slice(0, 8)}
        ctaTo="/shop?filter=bestsellers"
      />
      <FlashSale />
      <BookRail
        eyebrow="Rising Fast"
        title="Trending This Week"
        subtitle="What readers are adding to their carts."
        books={getTrending().length ? getTrending() : books.slice(2, 10)}
        ctaTo="/shop?filter=trending"
      />
      <WhyChooseUs />
      <BookRail
        eyebrow="Just In"
        title="New Arrivals"
        subtitle="Fresh off the press."
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
