interface WebsiteSyncConfig {
  serverUrl: string;
  syncToken: string;
  syncInterval?: number; // in milliseconds
}

interface SyncData {
  success: boolean;
  data: any;
  lastUpdated: string;
  type: string;
  error?: string;
}

class WebsiteSyncClient {
  private config: WebsiteSyncConfig;
  private syncIntervals: Map<string, NodeJS.Timeout> = new Map();
  private lastSyncTimes: Map<string, string> = new Map();

  constructor(config: WebsiteSyncConfig) {
    this.config = {
      syncInterval: 30000, // 30 seconds default
      ...config
    };
  }

  private async pullData(type: 'products' | 'orders' | 'settings'): Promise<SyncData> {
    try {
      const response = await fetch(`${this.config.serverUrl}/api/sync/pull/${type}`, {
        headers: {
          'X-Sync-Token': this.config.syncToken,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      return data;
    } catch (error: any) {
      console.error(`Failed to pull ${type} from AWS server:`, error);
      return {
        success: false,
        data: null,
        lastUpdated: new Date().toISOString(),
        type,
        error: error.message
      };
    }
  }

  // Pull products from AWS server
  async pullProducts(): Promise<any[]> {
    const result = await this.pullData('products');
    
    if (result.success) {
      this.lastSyncTimes.set('products', result.lastUpdated);
      return result.data || [];
    }
    
    return [];
  }

  // Pull orders from AWS server
  async pullOrders(): Promise<any[]> {
    const result = await this.pullData('orders');
    
    if (result.success) {
      this.lastSyncTimes.set('orders', result.lastUpdated);
      return result.data || [];
    }
    
    return [];
  }

  // Pull settings from AWS server
  async pullSettings(): Promise<any> {
    const result = await this.pullData('settings');
    
    if (result.success) {
      this.lastSyncTimes.set('settings', result.lastUpdated);
      return result.data || {};
    }
    
    return {};
  }

  // Start automatic sync for a specific data type
  startAutoSync(type: 'products' | 'orders' | 'settings', callback?: (data: any) => void) {
    // Clear existing interval if any
    this.stopAutoSync(type);

    const interval = setInterval(async () => {
      try {
        let data;
        switch (type) {
          case 'products':
            data = await this.pullProducts();
            break;
          case 'orders':
            data = await this.pullOrders();
            break;
          case 'settings':
            data = await this.pullSettings();
            break;
        }

        if (callback && data) {
          callback(data);
        }

        console.log(`✅ Auto-synced ${type} from AWS server`);
      } catch (error) {
        console.error(`❌ Auto-sync failed for ${type}:`, error);
      }
    }, this.config.syncInterval);

    this.syncIntervals.set(type, interval);
    console.log(`🔄 Started auto-sync for ${type} (interval: ${this.config.syncInterval}ms)`);
  }

  // Stop automatic sync for a specific data type
  stopAutoSync(type: 'products' | 'orders' | 'settings') {
    const interval = this.syncIntervals.get(type);
    if (interval) {
      clearInterval(interval);
      this.syncIntervals.delete(type);
      console.log(`⏹️ Stopped auto-sync for ${type}`);
    }
  }

  // Stop all automatic syncs
  stopAllAutoSync() {
    for (const [type] of this.syncIntervals) {
      this.stopAutoSync(type as 'products' | 'orders' | 'settings');
    }
  }

  // Get last sync time for a data type
  getLastSyncTime(type: string): string | null {
    return this.lastSyncTimes.get(type) || null;
  }

  // Manual sync all data types
  async syncAll(): Promise<{
    products: any[];
    orders: any[];
    settings: any;
  }> {
    const [products, orders, settings] = await Promise.all([
      this.pullProducts(),
      this.pullOrders(),
      this.pullSettings()
    ]);

    return { products, orders, settings };
  }

  // Health check for AWS server
  async healthCheck(): Promise<boolean> {
    try {
      const response = await fetch(`${this.config.serverUrl}/api/health`);
      return response.ok;
    } catch {
      return false;
    }
  }
}

// Singleton instance for website
let websiteSyncClient: WebsiteSyncClient | null = null;

export const getWebsiteSyncClient = (): WebsiteSyncClient | null => {
  // COMPLETELY DISABLED - No more AWS sync
  console.log('🚫 Website sync client is completely disabled');
  return null;
};

// Helper functions for Next.js API routes - COMPLETELY DISABLED
export const syncProductsFromAWS = async (): Promise<any[]> => {
  console.log('🚫 syncProductsFromAWS is completely disabled');
  return [];
};

export const syncOrdersFromAWS = async (): Promise<any[]> => {
  console.log('🚫 syncOrdersFromAWS is completely disabled');
  return [];
};

export const syncSettingsFromAWS = async (): Promise<any> => {
  console.log('🚫 syncSettingsFromAWS is completely disabled');
  return {};
};

export default WebsiteSyncClient;
