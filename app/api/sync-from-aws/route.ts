import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';

const AWS_SYNC_SERVER_URL = process.env.AWS_SYNC_SERVER_URL || 'http://3.111.208.77:3000';
const WEBSITE_SYNC_TOKEN = process.env.WEBSITE_SYNC_TOKEN || 'punjabi-heritage-website-sync-token-2024';

// Function to pull products from AWS server
async function pullProductsFromAWS() {
  try {
    console.log('🔄 Pulling products from AWS server...');
    
    const response = await fetch(`${AWS_SYNC_SERVER_URL}/api/sync/pull/products`, {
      headers: {
        'X-Sync-Token': WEBSITE_SYNC_TOKEN
      }
    });

    if (!response.ok) {
      throw new Error(`AWS server responded with ${response.status}: ${response.statusText}`);
    }

    const result = await response.json();
    
    if (result.success) {
      console.log(`✅ Successfully pulled ${result.data.length} products from AWS`);
      return result.data;
    } else {
      throw new Error(result.error || 'Failed to pull products from AWS');
    }
  } catch (error: any) {
    console.error('❌ Failed to pull from AWS:', error);
    throw error;
  }
}

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
    
    // Update or add products
    for (const product of products) {
      try {
        if (currentProductIds.has(product.id)) {
          // Update existing product
          await updateProduct(product.id, product);
          console.log(`✅ Updated product: ${product.name}`);
        } else {
          // Add new product
          await addProduct(product);
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
          console.log(`🗑️ Deleted product: ${currentProduct.name}`);
        } catch (error) {
          console.error(`❌ Failed to delete product ${currentProduct.name}:`, error);
        }
      }
    }
    
    console.log('✅ Website products updated successfully');
    return true;
  } catch (error: any) {
    console.error('❌ Failed to update website products:', error);
    return false;
  }
}

export async function GET(request: NextRequest) {
  try {
    console.log('🚀 Starting website sync from AWS...');

    // Pull latest products from AWS server
    const products = await pullProductsFromAWS();
    
    if (!products || products.length === 0) {
      return NextResponse.json({
        success: true,
        message: 'No products to sync',
        count: 0,
        timestamp: new Date().toISOString()
      });
    }

    // Update website products
    const updated = await updateWebsiteProducts(products);
    
    if (!updated) {
      return NextResponse.json({
        success: false,
        error: 'Failed to update website products'
      }, { status: 500 });
    }

    // Revalidate all product pages to clear cache
    try {
      revalidatePath('/');
      revalidatePath('/products');
      revalidatePath('/men');
      revalidatePath('/women');
      revalidatePath('/kids');
      revalidatePath('/phulkari');
      console.log('🔄 Cache revalidated for all product pages');
    } catch (revalidateError) {
      console.warn('⚠️ Failed to revalidate paths:', revalidateError);
    }

    console.log(`🎉 Successfully synced ${products.length} products from AWS to website`);

    return NextResponse.json({
      success: true,
      message: `Successfully synced ${products.length} products from AWS`,
      count: products.length,
      timestamp: new Date().toISOString()
    });

  } catch (error: any) {
    console.error('❌ Website sync error:', error);
    return NextResponse.json({
      success: false,
      error: error.message || 'Sync operation failed',
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  // Allow both GET and POST requests for flexibility
  return GET(request);
}
