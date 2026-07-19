import type { Address, Order, WalletTransaction, Notification } from './types'

export const addresses: Address[] = [
  {
    id: 'addr-1',
    label: 'Home',
    name: 'Prasann Hiremath',
    line1: '221B Baker Colony, HSR Layout',
    city: 'Bengaluru',
    state: 'Karnataka',
    zip: '560102',
    phone: '+91 98765 43210',
    isDefault: true,
  },
  {
    id: 'addr-2',
    label: 'Office',
    name: 'Prasann Hiremath',
    line1: '4th Floor, Prestige Tech Park, Marathahalli',
    city: 'Bengaluru',
    state: 'Karnataka',
    zip: '560037',
    phone: '+91 98765 43210',
  },
]

// Placeholder items — real orders now come from useOrders() (see hooks/useOrders.ts).
// This mock list only backs Overview.tsx's recent-orders widget and
// InvoicesPage.tsx, which weren't part of the orders migration.
export const orders: Order[] = [
  {
    id: 'FOL-100234',
    date: 'Jul 2, 2026',
    status: 'Delivered',
    items: [
      { bookId: 'bk-1', title: 'रावण राजा राक्षसांचा', cover: '/covers/cover005.png', price: 450, quantity: 1 },
    ],
    total: 450,
    address: 'Home — HSR Layout, Bengaluru',
    timeline: [
      { status: 'Processing', date: 'Jul 2, 2026', done: true },
      { status: 'Shipped', date: 'Jul 3, 2026', done: true },
      { status: 'Out for Delivery', date: 'Jul 5, 2026', done: true },
      { status: 'Delivered', date: 'Jul 6, 2026', done: true },
    ],
  },
]

export const walletBalance = 450
export const walletTransactions: WalletTransaction[] = [
  { id: 'wt-1', type: 'credit', amount: 200, reason: 'Referral bonus — Aria M. joined', date: 'Jul 1, 2026' },
  { id: 'wt-2', type: 'debit', amount: 50, reason: 'Applied on order FOL-100234', date: 'Jul 2, 2026' },
  { id: 'wt-3', type: 'credit', amount: 300, reason: 'Cashback — Flash Sale purchase', date: 'Jun 20, 2026' },
]

export const rewardPoints = 1280
export const rewardHistory = [
  { id: 'rw-1', label: 'Order FOL-100234', points: 90, date: 'Jul 2, 2026' },
  { id: 'rw-2', label: 'Order FOL-100198', points: 60, date: 'Jun 20, 2026' },
  { id: 'rw-3', label: 'Referral bonus', points: 500, date: 'Jun 15, 2026' },
]

export const notifications: Notification[] = [
  { id: 'n1', title: 'Your order is out for delivery', body: 'FOL-100198 will arrive today by 8 PM.', date: '2h ago', read: false, type: 'order' },
  { id: 'n2', title: 'Flash Sale starts in 3 hours', body: 'Up to 30% off select bestsellers.', date: '5h ago', read: false, type: 'offer' },
  { id: 'n3', title: 'Order delivered', body: 'FOL-100234 was delivered successfully.', date: '1d ago', read: true, type: 'order' },
  { id: 'n4', title: 'Password changed', body: 'Your account password was updated.', date: '3d ago', read: true, type: 'system' },
]

export const invoices = orders.map((o) => ({ id: `INV-${o.id.split('-')[1]}`, orderId: o.id, date: o.date, total: o.total }))
