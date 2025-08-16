// ADD THIS TO YOUR LIVE WEBSITE
// This should be integrated into your website's product loading system

const AWS_SYNC_SERVER_URL = 'http://3.111.208.77:3001';
const WEBSITE_SYNC_TOKEN = 'punjabi-heritage-website-sync-token-2024';

// Function to pull updates from AWS server
async function pullUpdatesFromAWS() {
  try {
    const response = await fetch(`${AWS_SYNC_SERVER_URL}/api/sync/pull/products`, {
      headers: {
        'X-Sync-Token': WEBSITE_SYNC_TOKEN
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const result = await response.json();
    if (result.success) {
      console.log('✅ Pulled products from AWS:', result.data.length, 'products');
      return result.data;
    } else {
      console.error('❌ Failed to pull from AWS:', result.error);
      return null;
    }
  } catch (error) {
    console.error('❌ AWS pull error:', error);
    return null;
  }
}

// Function to update your website's product cache/database
async function updateWebsiteProducts() {
  try {
    // 1. Pull latest products from AWS server
    const latestProducts = await pullUpdatesFromAWS();
    
    if (latestProducts) {
      // 2. Update your website's product storage
      await updateYourWebsiteProductStorage(latestProducts);
      
      // 3. Optionally trigger a page revalidation (for Next.js)
      if (typeof window === 'undefined') {
        // Server-side: trigger revalidation
        await fetch('/api/revalidate?path=/products');
      }
      
      console.log('✅ Website products updated');
      return true;
    }
    
    return false;
  } catch (error) {
    console.error('❌ Failed to update website products:', error);
    return false;
  }
}

// Auto-sync function (call this periodically)
async function startAutoSync() {
  console.log('🔄 Starting auto-sync...');
  
  // Update immediately
  await updateWebsiteProducts();
  
  // Then update every 30 seconds
  setInterval(async () => {
    console.log('🔄 Auto-syncing products...');
    await updateWebsiteProducts();
  }, 30000); // 30 seconds
}

// For Next.js API route - create this file: /pages/api/sync-products.js or /app/api/sync-products/route.js
export async function syncProductsAPI() {
  try {
    const updated = await updateWebsiteProducts();
    
    return {
      success: updated,
      message: updated ? 'Products synced successfully' : 'Sync failed',
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    return {
      success: false,
      error: error.message,
      timestamp: new Date().toISOString()
    };
  }
}

// Manual sync function (for testing)
async function manualSync() {
  console.log('🔄 Manual sync triggered...');
  const result = await updateWebsiteProducts();
  console.log(result ? '✅ Manual sync completed' : '❌ Manual sync failed');
  return result;
}

// Health check for AWS server
async function checkAWSHealth() {
  try {
    const response = await fetch(`${AWS_SYNC_SERVER_URL}/api/health`);
    const result = await response.json();
    console.log('AWS Server Health:', result);
    return result.status === 'healthy';
  } catch (error) {
    console.error('AWS server health check failed:', error);
    return false;
  }
}

// Example usage:
// startAutoSync(); // Start automatic syncing
// manualSync();    // Trigger manual sync
// checkAWSHealth(); // Check if AWS server is running
