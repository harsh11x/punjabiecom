// ADD THIS TO YOUR ADMIN PANEL PRODUCT FUNCTIONS
// This code should be integrated into your existing admin panel

const AWS_SYNC_SERVER_URL = 'http://3.111.208.77:3001';
const AWS_SYNC_SECRET = 'punjabi-heritage-sync-secret-2024';

// Function to sync with AWS server
async function syncToAWS(action, data) {
  try {
    const response = await fetch(`${AWS_SYNC_SERVER_URL}/api/sync/products`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${AWS_SYNC_SECRET}`
      },
      body: JSON.stringify({
        action: action, // 'add', 'update', 'delete'
        product: data
      })
    });

    const result = await response.json();
    if (result.success) {
      console.log('✅ Synced to AWS:', action, data.name || data.id);
    } else {
      console.error('❌ AWS sync failed:', result.error);
    }
    return result.success;
  } catch (error) {
    console.error('❌ AWS sync error:', error);
    return false;
  }
}

// MODIFY YOUR EXISTING ADMIN FUNCTIONS LIKE THIS:

// When adding a product
async function addProduct(productData) {
  try {
    // 1. Save to your current system (MongoDB/file/etc.)
    const savedProduct = await saveProductToCurrentSystem(productData);
    
    // 2. Sync to AWS server
    await syncToAWS('add', savedProduct);
    
    return savedProduct;
  } catch (error) {
    console.error('Failed to add product:', error);
    throw error;
  }
}

// When updating a product
async function updateProduct(productId, productData) {
  try {
    // 1. Update in your current system
    const updatedProduct = await updateProductInCurrentSystem(productId, productData);
    
    // 2. Sync to AWS server
    await syncToAWS('update', updatedProduct);
    
    return updatedProduct;
  } catch (error) {
    console.error('Failed to update product:', error);
    throw error;
  }
}

// When deleting a product
async function deleteProduct(productId) {
  try {
    // 1. Delete from your current system
    await deleteProductFromCurrentSystem(productId);
    
    // 2. Sync to AWS server
    await syncToAWS('delete', { id: productId });
    
    return true;
  } catch (error) {
    console.error('Failed to delete product:', error);
    throw error;
  }
}

// Test function to check if AWS server is working
async function testAWSConnection() {
  try {
    const response = await fetch(`${AWS_SYNC_SERVER_URL}/api/health`);
    const result = await response.json();
    console.log('AWS Server Status:', result);
    return result.status === 'healthy';
  } catch (error) {
    console.error('AWS server not reachable:', error);
    return false;
  }
}
