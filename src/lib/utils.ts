export function formatPrice(value: number) {
  return `₹${Math.round(value).toLocaleString('en-IN')}`
}

export function discountPercent(price: number, originalPrice?: number) {
  if (!originalPrice || originalPrice <= price) return 0
  return Math.round(((originalPrice - price) / originalPrice) * 100)
}
