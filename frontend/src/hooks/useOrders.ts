import { useEffect, useState } from 'react'
import { fetchOrders } from '@/lib/api'
import { useAuth } from '@/context/AuthContext'
import type { Order } from '@/data/types'

export function useOrders() {
  const { token } = useAuth()
  const [orders, setOrders] = useState<Order[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!token) {
      setIsLoading(false)
      return
    }
    fetchOrders(token)
      .then(({ orders }) => setOrders(orders))
      .catch((err) => setError(err.message))
      .finally(() => setIsLoading(false))
  }, [token])

  return { orders, isLoading, error }
}
