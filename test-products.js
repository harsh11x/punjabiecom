// Test script to check product storage
const fs = require('fs');
const path = require('path');

// Read the products file
const productsFile = path.join(__dirname, 'data', 'products.json');

console.log('🔍 Checking products file:', productsFile);

if (fs.existsSync(productsFile)) {
  try {
    const data = fs.readFileSync(productsFile, 'utf8');
    const products = JSON.parse(data);
    
    console.log(`📦 Found ${products.length} products in file`);
    
    // Show the structure of each product
    products.forEach((product, index) => {
      console.log(`\n--- Product ${index + 1} ---`);
      console.log(`ID: ${product.id}`);
      console.log(`Name: ${product.name}`);
      console.log(`Category: ${product.category}`);
      console.log(`Subcategory: ${product.subcategory}`);
      console.log(`Stock: ${product.stock}`);
      console.log(`IsActive: ${product.isActive}`);
    });
    
    // Check for any products that might be in wrong categories
    console.log('\n🔍 Category Analysis:');
    const categoryCount = {};
    const subcategoryCount = {};
    
    products.forEach(product => {
      categoryCount[product.category] = (categoryCount[product.category] || 0) + 1;
      if (product.subcategory) {
        subcategoryCount[product.subcategory] = (subcategoryCount[product.subcategory] || 0) + 1;
      }
    });
    
    console.log('Categories:', categoryCount);
    console.log('Subcategories:', subcategoryCount);
    
    // Check for any products that might be miscategorized
    const miscategorized = products.filter(p => 
      p.category === 'men' && p.subcategory === 'jutti' && p.name.toLowerCase().includes('kids')
    );
    
    if (miscategorized.length > 0) {
      console.log('\n⚠️ Potentially miscategorized products:');
      miscategorized.forEach(p => {
        console.log(`- ${p.name} (ID: ${p.id}) - Category: ${p.category}, Subcategory: ${p.subcategory}`);
      });
    }
    
  } catch (error) {
    console.error('❌ Error reading products file:', error);
  }
} else {
  console.log('❌ Products file not found');
}
