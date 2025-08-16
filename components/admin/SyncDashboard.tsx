'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, Server, CheckCircle, XCircle, RefreshCw, Activity, Clock } from 'lucide-react';
import { useAWSSync } from '@/hooks/useAWSSync';

interface SyncLog {
  id: string;
  timestamp: string;
  action: string;
  status: 'success' | 'error';
  data: string;
}

export default function SyncDashboard() {
  const {
    syncStatus,
    checkServerHealth,
    getSyncLogs,
    bulkSyncProducts,
    resetSyncStatus
  } = useAWSSync();

  const [serverHealth, setServerHealth] = useState<boolean | null>(null);
  const [syncLogs, setSyncLogs] = useState<SyncLog[]>([]);
  const [isCheckingHealth, setIsCheckingHealth] = useState(false);
  const [isLoadingLogs, setIsLoadingLogs] = useState(false);

  // Check server health on component mount
  useEffect(() => {
    handleHealthCheck();
    loadSyncLogs();
  }, []);

  const handleHealthCheck = async () => {
    setIsCheckingHealth(true);
    try {
      const isHealthy = await checkServerHealth();
      setServerHealth(isHealthy);
    } catch (error) {
      setServerHealth(false);
    } finally {
      setIsCheckingHealth(false);
    }
  };

  const loadSyncLogs = async () => {
    setIsLoadingLogs(true);
    try {
      const logs = await getSyncLogs(50);
      setSyncLogs(logs);
    } catch (error) {
      console.error('Failed to load sync logs:', error);
    } finally {
      setIsLoadingLogs(false);
    }
  };

  const handleBulkSync = async () => {
    try {
      // Get products from local storage or API
      const response = await fetch('/api/admin/products');
      const products = await response.json();
      
      const success = await bulkSyncProducts(products);
      if (success) {
        await loadSyncLogs(); // Refresh logs
      }
    } catch (error) {
      console.error('Bulk sync failed:', error);
    }
  };

  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleString();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success':
        return 'bg-green-100 text-green-800';
      case 'error':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">AWS Sync Dashboard</h2>
        <Button
          onClick={handleHealthCheck}
          disabled={isCheckingHealth}
          variant="outline"
          size="sm"
        >
          {isCheckingHealth ? (
            <Loader2 className="h-4 w-4 animate-spin mr-2" />
          ) : (
            <RefreshCw className="h-4 w-4 mr-2" />
          )}
          Check Health
        </Button>
      </div>

      {/* Server Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Server className="h-5 w-5" />
            Server Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              {serverHealth === null ? (
                <div className="h-3 w-3 bg-gray-400 rounded-full animate-pulse" />
              ) : serverHealth ? (
                <CheckCircle className="h-5 w-5 text-green-500" />
              ) : (
                <XCircle className="h-5 w-5 text-red-500" />
              )}
              <span className="font-medium">
                {serverHealth === null
                  ? 'Checking...'
                  : serverHealth
                  ? 'Connected'
                  : 'Disconnected'}
              </span>
            </div>
            
            {serverHealth && (
              <Badge variant="secondary" className="bg-green-100 text-green-800">
                AWS Server Online
              </Badge>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Sync Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Sync Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {syncStatus.error && (
              <Alert variant="destructive">
                <XCircle className="h-4 w-4" />
                <AlertDescription>{syncStatus.error}</AlertDescription>
              </Alert>
            )}

            {syncStatus.success && !syncStatus.error && (
              <Alert>
                <CheckCircle className="h-4 w-4" />
                <AlertDescription>Last sync completed successfully</AlertDescription>
              </Alert>
            )}

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {syncStatus.isLoading && (
                  <Loader2 className="h-4 w-4 animate-spin" />
                )}
                <span className="text-sm text-gray-600">
                  {syncStatus.lastSync ? (
                    <>Last sync: {formatTimestamp(syncStatus.lastSync)}</>
                  ) : (
                    'No recent sync activity'
                  )}
                </span>
              </div>

              <div className="flex gap-2">
                <Button
                  onClick={resetSyncStatus}
                  variant="outline"
                  size="sm"
                >
                  Clear Status
                </Button>
                <Button
                  onClick={handleBulkSync}
                  disabled={syncStatus.isLoading || !serverHealth}
                  size="sm"
                >
                  {syncStatus.isLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  ) : (
                    <RefreshCw className="h-4 w-4 mr-2" />
                  )}
                  Bulk Sync Products
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Sync Logs */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Recent Sync Activity
            </div>
            <Button
              onClick={loadSyncLogs}
              disabled={isLoadingLogs}
              variant="outline"
              size="sm"
            >
              {isLoadingLogs ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : (
                <RefreshCw className="h-4 w-4 mr-2" />
              )}
              Refresh
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {syncLogs.length === 0 ? (
            <p className="text-gray-500 text-center py-4">No sync activity found</p>
          ) : (
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {syncLogs.map((log) => (
                <div
                  key={log.id}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <Badge className={getStatusColor(log.status)}>
                      {log.status}
                    </Badge>
                    <span className="font-medium">{log.action}</span>
                    <span className="text-sm text-gray-600">
                      {formatTimestamp(log.timestamp)}
                    </span>
                  </div>
                  {log.data && (
                    <span className="text-xs text-gray-500 max-w-xs truncate">
                      {log.data}
                    </span>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Configuration Info */}
      <Card>
        <CardHeader>
          <CardTitle>Configuration</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Server URL:</span>
              <span className="font-mono">
                {process.env.NEXT_PUBLIC_AWS_SYNC_SERVER_URL || 'Not configured'}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Auto-sync:</span>
              <span>Enabled on product changes</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Sync Types:</span>
              <span>Products, Orders, Settings</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
