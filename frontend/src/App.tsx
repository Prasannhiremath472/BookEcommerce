import { Routes, Route } from 'react-router-dom'
import { Layout } from '@/components/layout/Layout'
import { ScrollToTop } from '@/components/layout/ScrollToTop'
import { CartProvider } from '@/context/CartContext'
import { WishlistProvider } from '@/context/WishlistContext'
import { LanguageProvider, useLanguage } from '@/context/LanguageContext'
import { AuthProvider } from '@/context/AuthContext'
import { RequireAuth } from '@/components/auth/RequireAuth'
import { Home } from '@/pages/Home'
import { Login } from '@/pages/Login'
import { Shop } from '@/pages/Shop'
import { BookDetails } from '@/pages/BookDetails'
import { CartPage } from '@/pages/CartPage'
import { Checkout } from '@/pages/Checkout'
import { OrderConfirmation } from '@/pages/OrderConfirmation'
import { ComingSoon } from '@/pages/ComingSoon'
import { About } from '@/pages/About'
import { AccountLayout } from '@/components/account/AccountLayout'
import { Overview } from '@/pages/account/Overview'
import { Orders } from '@/pages/account/Orders'
import { WishlistPage } from '@/pages/account/WishlistPage'
import { WalletPage } from '@/pages/account/WalletPage'
import { RewardsPage } from '@/pages/account/RewardsPage'
import { InvoicesPage } from '@/pages/account/InvoicesPage'
import { MyReviewsPage } from '@/pages/account/MyReviewsPage'
import { NotificationsPage } from '@/pages/account/NotificationsPage'

function NotFoundPage() {
  const { t } = useLanguage()
  return <ComingSoon title={t('pageNotFound')} />
}

export default function App() {
  return (
    <LanguageProvider>
      <AuthProvider>
        <CartProvider>
          <WishlistProvider>
            <ScrollToTop />
            <Layout>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/shop" element={<Shop />} />
                <Route path="/book/:id" element={<BookDetails />} />
                <Route path="/cart" element={<CartPage />} />
                <Route
                  path="/checkout"
                  element={
                    <RequireAuth>
                      <Checkout />
                    </RequireAuth>
                  }
                />
                <Route path="/order-confirmation" element={<OrderConfirmation />} />
                <Route path="/wishlist" element={<WishlistPage />} />
                <Route path="/about" element={<About />} />
                <Route path="/login" element={<Login />} />

                <Route
                  path="/account"
                  element={
                    <RequireAuth>
                      <AccountLayout />
                    </RequireAuth>
                  }
                >
                  <Route index element={<Overview />} />
                  <Route path="orders" element={<Orders />} />
                  <Route path="wishlist" element={<WishlistPage />} />
                  <Route path="wallet" element={<WalletPage />} />
                  <Route path="rewards" element={<RewardsPage />} />
                  <Route path="invoices" element={<InvoicesPage />} />
                  <Route path="reviews" element={<MyReviewsPage />} />
                  <Route path="notifications" element={<NotificationsPage />} />
                </Route>

                <Route path="*" element={<NotFoundPage />} />
              </Routes>
            </Layout>
          </WishlistProvider>
        </CartProvider>
      </AuthProvider>
    </LanguageProvider>
  )
}
