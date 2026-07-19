const STATUS_SEQUENCE = ['Processing', 'Shipped', 'Out for Delivery', 'Delivered'] as const

export function buildTimeline(status: string, updatedAt: Date) {
  if (status === 'Cancelled') {
    return [{ status: 'Cancelled', date: updatedAt.toDateString(), done: true }]
  }
  const currentIndex = STATUS_SEQUENCE.indexOf(status as (typeof STATUS_SEQUENCE)[number])
  return STATUS_SEQUENCE.map((s, i) => ({
    status: s,
    date: i <= currentIndex ? updatedAt.toDateString() : '',
    done: i <= currentIndex,
  }))
}
