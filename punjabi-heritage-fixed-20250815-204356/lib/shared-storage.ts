import { type Order } from '@/lib/order-management'
import fs from 'fs'
import path from 'path'

// File-based storage paths
const DATA_DIR = path.resolve(process.cwd(), 'data')
const ORDERS_FILE = path.join(DATA_DIR, 'orders.json')

// Ensure data directory exists
if (typeof window === 'undefined') { // Only run on server
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true })
  }
}

// In-memory cache for performance
let ordersCache: Map<string, Order> | null = null

// Load orders from file
function loadOrdersFromFile(): Map<string, Order> {
  if (typeof window !== 'undefined') return new Map() // Client-side fallback
  
  if (!fs.existsSync(ORDERS_FILE)) {
    fs.writeFileSync(ORDERS_FILE, JSON.stringify([]), 'utf8')
    return new Map()
  }
  
  try {
    const data = fs.readFileSync(ORDERS_FILE, 'utf8')
    const ordersArray = JSON.parse(data)
    const ordersMap = new Map()
    
    ordersArray.forEach((order: Order) => {
      ordersMap.set(order.id, order)
    })
    
    return ordersMap
  } catch (error) {
    console.error('Error loading orders from file:', error)
    return new Map()
  }
}

// Save orders to file
function saveOrdersToFile(ordersMap: Map<string, Order>) {
  if (typeof window !== 'undefined') return // Don't run on client
  
  try {
    const ordersArray = Array.from(ordersMap.values())
    fs.writeFileSync(ORDERS_FILE, JSON.stringify(ordersArray, null, 2), 'utf8')
  } catch (error) {
    console.error('Error saving orders to file:', error)
  }
}

// Initialize orders cache
function getOrdersCache(): Map<string, Order> {
  if (!ordersCache) {
    ordersCache = loadOrdersFromFile()
  }
  return ordersCache
}

// Shared storage with file persistence
export const orders = {
  get(orderId: string): Order | undefined {
    return getOrdersCache().get(orderId)
  },
  
  set(orderId: string, order: Order): void {
    getOrdersCache().set(orderId, order)
    saveOrdersToFile(getOrdersCache())
  },
  
  has(orderId: string): boolean {
    return getOrdersCache().has(orderId)
  },
  
  delete(orderId: string): boolean {
    const result = getOrdersCache().delete(orderId)
    if (result) {
      saveOrdersToFile(getOrdersCache())
    }
    return result
  },
  
  values(): IterableIterator<Order> {
    return getOrdersCache().values()
  },
  
  clear(): void {
    getOrdersCache().clear()
    saveOrdersToFile(getOrdersCache())
  }
}

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
