// Simple mock useSocket hook to prevent errors
export function useSocket(options?: any) {
  // Return a mock socket object
  return {
    connected: false,
    emit: () => {},
    on: () => {},
    off: () => {},
    disconnect: () => {}
  }
}
