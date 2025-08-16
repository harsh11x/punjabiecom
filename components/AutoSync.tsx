'use client';

import { useEffect, useState } from 'react';

interface AutoSyncProps {
  interval?: number; // in milliseconds, default 30 seconds
  enabled?: boolean;
}

export default function AutoSync({ interval = 30000, enabled = true }: AutoSyncProps) {
  const [lastSync, setLastSync] = useState<string | null>(null);
  const [syncStatus, setSyncStatus] = useState<'idle' | 'syncing' | 'success' | 'error'>('idle');

  useEffect(() => {
    if (!enabled) return;

    const performSync = async () => {
      try {
        setSyncStatus('syncing');
        console.log('🔄 Auto-syncing products from AWS...');

        const response = await fetch('/api/sync-from-aws', {
          method: 'GET',
          cache: 'no-cache'
        });

        if (response.ok) {
          const result = await response.json();
          if (result.success) {
            console.log(`✅ Auto-sync successful: ${result.count} products synced`);
            setLastSync(new Date().toISOString());
            setSyncStatus('success');
          } else {
            console.error('❌ Auto-sync failed:', result.error);
            setSyncStatus('error');
          }
        } else {
          console.error('❌ Auto-sync HTTP error:', response.status);
          setSyncStatus('error');
        }
      } catch (error) {
        console.error('❌ Auto-sync error:', error);
        setSyncStatus('error');
      }

      // Reset status after 5 seconds
      setTimeout(() => setSyncStatus('idle'), 5000);
    };

    // Perform initial sync
    performSync();

    // Set up interval
    const intervalId = setInterval(performSync, interval);

    return () => clearInterval(intervalId);
  }, [interval, enabled]);

  // Don't render anything visible - this is a background component
  if (process.env.NODE_ENV === 'development') {
    // Only show sync status in development
    return (
      <div className="fixed bottom-4 right-4 z-50">
        <div className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
          syncStatus === 'syncing' ? 'bg-blue-100 text-blue-800' :
          syncStatus === 'success' ? 'bg-green-100 text-green-800' :
          syncStatus === 'error' ? 'bg-red-100 text-red-800' :
          'bg-gray-100 text-gray-600'
        }`}>
          {syncStatus === 'syncing' && '🔄 Syncing...'}
          {syncStatus === 'success' && '✅ Synced'}
          {syncStatus === 'error' && '❌ Sync Failed'}
          {syncStatus === 'idle' && lastSync && `🔄 Last sync: ${new Date(lastSync).toLocaleTimeString()}`}
          {syncStatus === 'idle' && !lastSync && '⏳ Waiting...'}
        </div>
      </div>
    );
  }

  return null;
}
