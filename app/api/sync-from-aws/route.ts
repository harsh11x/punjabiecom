import { NextRequest, NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'

// AWS Sync Configuration (Disabled for now)
const AWS_SYNC_SERVER_URL = 'http://localhost:3000'; // Disabled
const WEBSITE_SYNC_TOKEN = 'disabled';

// Function to update website's product storage
async function updateWebsiteProducts(products: any[]) {
  try {
    console.log(`🔄 Updating website with ${products.length} products...`);
    
    // Import your product manager functions
    const { getAllProducts, addProduct, updateProduct, deleteProduct } = await import('@/lib/product-manager');
    
    // Get current products
    const currentProducts = await getAllProducts();
    const currentProductIds = new Set(currentProducts.map(p => p.id));
    const newProductIds = new Set(products.map(p => p.id));
    
    let addedCount = 0;
    let updatedCount = 0;
    let deletedCount = 0;
    
    // Update or add products
    for (const product of products) {
      try {
        if (currentProductIds.has(product.id)) {
          // Update existing product
          await updateProduct(product.id, product);
          updatedCount++;
          console.log(`✅ Updated product: ${product.name}`);
        } else {
          // Add new product
          await addProduct(product);
          addedCount++;
          console.log(`✅ Added new product: ${product.name}`);
        }
      } catch (error) {
        console.error(`❌ Failed to sync product ${product.name}:`, error);
      }
    }
    
    // Delete products that are no longer in AWS
    for (const currentProduct of currentProducts) {
      if (!newProductIds.has(currentProduct.id)) {
        try {
          await deleteProduct(currentProduct.id);
          deletedCount++;
          console.log(`🗑️ Deleted product: ${currentProduct.name}`);
        } catch (error) {
          console.error(`❌ Failed to delete product ${currentProduct.name}:`, error);
        }
      }
    }
    
    console.log(`✅ Website sync complete: +${addedCount} ~${updatedCount} -${deletedCount}`);
    return {
      success: true,
      added: addedCount,
      updated: updatedCount,
      deleted: deletedCount,
      total: products.length
    };
  } catch (error: any) {
    console.error('❌ Failed to update website products:', error);
    return {
      success: false,
      error: error.message,
      added: 0,
      updated: 0,
      deleted: 0,
      total: 0
    };
  }
}

// GET and POST - Sync products from AWS server
export async function GET() {
  return handleSync();
}

export async function POST() {
  return handleSync();
}

async function handleSync() {
  try {
    console.log('🔄 Starting sync from AWS server...');
    console.log('AWS Server URL:', AWS_SYNC_SERVER_URL);
    
    // Fetch products from AWS server
    const response = await fetch(`${AWS_SYNC_SERVER_URL}/api/sync/pull/products`, {
      method: 'GET',
      headers: {
        'X-Sync-Token': WEBSITE_SYNC_TOKEN,
        'User-Agent': 'Punjabi-Heritage-Website/1.0',
        'Accept': 'application/json'
      },
      // Add timeout and retry logic
      signal: AbortSignal.timeout(15000) // 15 second timeout
    });

    if (!response.ok) {
      const errorText = await response.text().catch(() => 'Unknown error');
      throw new Error(`AWS server responded with ${response.status}: ${errorText}`);
    }

    const awsData = await response.json();
    console.log(`📦 Received ${awsData.products?.length || 0} products from AWS`);

    if (!awsData.success || !Array.isArray(awsData.products)) {
      throw new Error('Invalid response format from AWS server');
    }

    // Update website products
    const updateResult = await updateWebsiteProducts(awsData.products);
    
    if (!updateResult.success) {
      throw new Error(updateResult.error || 'Failed to update website products');
    }

    // Revalidate relevant pages
    try {
      revalidatePath('/');
      revalidatePath('/products');
      revalidatePath('/admin');
      console.log('✅ Pages revalidated');
    } catch (revalidateError) {
      console.warn('⚠️ Page revalidation failed:', revalidateError);
    }

    const totalChanges = (updateResult.added || 0) + (updateResult.updated || 0) + (updateResult.deleted || 0);
    
    return NextResponse.json({
      success: true,
      message: `Successfully synced ${awsData.products.length} products from AWS`,
      count: totalChanges,
      details: {
        total: awsData.products.length,
        added: updateResult.added || 0,
        updated: updateResult.updated || 0,
        deleted: updateResult.deleted || 0
      },
      timestamp: new Date().toISOString(),
      source: 'aws-server'
    });

  } catch (error: any) {
    console.error('❌ Sync from AWS failed:', error);
    
    // Return error but don't crash
    return NextResponse.json({
      success: false,
      error: 'Failed to sync from AWS server',
      details: error.message,
      timestamp: new Date().toISOString(),
      fallback: 'Using local products only'
    }, { status: 500 });
  }
}
