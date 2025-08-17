// Simple mock useSocket hook to prevent errors

interface SocketOptions {
  onProductUpdate?: (data: any) => void
  onCartUpdate?: (data: any) => void
  onOrderUpdate?: (data: any) => void
  [key: string]: any
}

interface MockSocket {
  connected: boolean
  emit: (event: string, data?: any) => void
  on: (event: string, callback: (data: any) => void) => void
  off: (event: string, callback?: (data: any) => void) => void
  disconnect: () => void
}

export function useSocket(options?: SocketOptions): MockSocket {
  // Return a mock socket object
  return {
    connected: false,
    emit: (event: string, data?: any) => {
      // Mock emit - does nothing
    },
    on: (event: string, callback: (data: any) => void) => {
      // Mock on - does nothing
    },
    off: (event: string, callback?: (data: any) => void) => {
      // Mock off - does nothing
    },
    disconnect: () => {
      // Mock disconnect - does nothing
    }
  }
}
