import { type Order } from '@/lib/order-management'

// Shared in-memory storage for demo purposes
// In production, use a proper database
export const orders: Map<string, Order> = new Map()

// Export helper functions for order management
export function getOrder(orderId: string): Order | undefined {
  return orders.get(orderId)
}

export function setOrder(orderId: string, order: Order): void {
  orders.set(orderId, order)
}

export function getAllOrders(): Order[] {
  return Array.from(orders.values())
}

export function deleteOrder(orderId: string): boolean {
  return orders.delete(orderId)
}
