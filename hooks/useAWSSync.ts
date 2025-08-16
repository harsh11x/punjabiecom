import { useState, useCallback } from 'react';
import { getAWSyncClient, syncProductToAWS, syncOrderToAWS, syncSettingsToAWS } from '@/lib/aws-sync-client';

interface SyncStatus {
  isLoading: boolean;
  lastSync: string | null;
  error: string | null;
  success: boolean;
}

interface UseSyncReturn {
  syncStatus: SyncStatus;
  syncProduct: (action: 'add' | 'update' | 'delete', product: any) => Promise<boolean>;
  syncOrder: (action: 'add' | 'update', order: any) => Promise<boolean>;
  syncSettings: (settings: any) => Promise<boolean>;
  bulkSyncProducts: (products: any[]) => Promise<boolean>;
  checkServerHealth: () => Promise<boolean>;
  getSyncLogs: (limit?: number) => Promise<any[]>;
  resetSyncStatus: () => void;
}

export const useAWSSync = (): UseSyncReturn => {
  const [syncStatus, setSyncStatus] = useState<SyncStatus>({
    isLoading: false,
    lastSync: null,
    error: null,
    success: false
  });

  const updateSyncStatus = useCallback((updates: Partial<SyncStatus>) => {
    setSyncStatus(prev => ({
      ...prev,
      ...updates,
      lastSync: updates.success ? new Date().toISOString() : prev.lastSync
    }));
  }, []);

  const syncProduct = useCallback(async (action: 'add' | 'update' | 'delete', product: any): Promise<boolean> => {
    updateSyncStatus({ isLoading: true, error: null });

    try {
      const result = await syncProductToAWS(action, product);
      
      if (result.success) {
        updateSyncStatus({ isLoading: false, success: true });
        return true;
      } else {
        updateSyncStatus({ 
          isLoading: false, 
          error: result.error || `Failed to sync product ${action}`,
          success: false 
        });
        return false;
      }
    } catch (error: any) {
      updateSyncStatus({ 
        isLoading: false, 
        error: error.message || 'Sync operation failed',
        success: false 
      });
      return false;
    }
  }, [updateSyncStatus]);

  const syncOrder = useCallback(async (action: 'add' | 'update', order: any): Promise<boolean> => {
    updateSyncStatus({ isLoading: true, error: null });

    try {
      const result = await syncOrderToAWS(action, order);
      
      if (result.success) {
        updateSyncStatus({ isLoading: false, success: true });
        return true;
      } else {
        updateSyncStatus({ 
          isLoading: false, 
          error: result.error || `Failed to sync order ${action}`,
          success: false 
        });
        return false;
      }
    } catch (error: any) {
      updateSyncStatus({ 
        isLoading: false, 
        error: error.message || 'Order sync failed',
        success: false 
      });
      return false;
    }
  }, [updateSyncStatus]);

  const syncSettings = useCallback(async (settings: any): Promise<boolean> => {
    updateSyncStatus({ isLoading: true, error: null });

    try {
      const result = await syncSettingsToAWS(settings);
      
      if (result.success) {
        updateSyncStatus({ isLoading: false, success: true });
        return true;
      } else {
        updateSyncStatus({ 
          isLoading: false, 
          error: result.error || 'Failed to sync settings',
          success: false 
        });
        return false;
      }
    } catch (error: any) {
      updateSyncStatus({ 
        isLoading: false, 
        error: error.message || 'Settings sync failed',
        success: false 
      });
      return false;
    }
  }, [updateSyncStatus]);

  const bulkSyncProducts = useCallback(async (products: any[]): Promise<boolean> => {
    updateSyncStatus({ isLoading: true, error: null });

    try {
      const client = getAWSyncClient();
      const result = await client.bulkSyncProducts(products);
      
      if (result.success) {
        updateSyncStatus({ isLoading: false, success: true });
        return true;
      } else {
        updateSyncStatus({ 
          isLoading: false, 
          error: result.error || 'Bulk sync failed',
          success: false 
        });
        return false;
      }
    } catch (error: any) {
      updateSyncStatus({ 
        isLoading: false, 
        error: error.message || 'Bulk sync failed',
        success: false 
      });
      return false;
    }
  }, [updateSyncStatus]);

  const checkServerHealth = useCallback(async (): Promise<boolean> => {
    try {
      const client = getAWSyncClient();
      const result = await client.healthCheck();
      return result.success;
    } catch {
      return false;
    }
  }, []);

  const getSyncLogs = useCallback(async (limit: number = 100): Promise<any[]> => {
    try {
      const client = getAWSyncClient();
      const result = await client.getSyncLogs(limit);
      return result.success ? result.data : [];
    } catch {
      return [];
    }
  }, []);

  const resetSyncStatus = useCallback(() => {
    setSyncStatus({
      isLoading: false,
      lastSync: null,
      error: null,
      success: false
    });
  }, []);

  return {
    syncStatus,
    syncProduct,
    syncOrder,
    syncSettings,
    bulkSyncProducts,
    checkServerHealth,
    getSyncLogs,
    resetSyncStatus
  };
};

export default useAWSSync;
