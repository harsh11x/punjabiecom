const bcrypt = require('bcryptjs')

async function generateHashedPassword() {
  const password = 'admin123'
  const hashedPassword = await bcrypt.hash(password, 12)
  
  console.log('✅ Admin credentials generated!')
  console.log('Email: admin@punjabijuttiandfulkari.com')
  console.log('Password: admin123')
  console.log('\n🔐 Hashed password for MongoDB:')
  console.log(hashedPassword)
  console.log('\n📋 MongoDB document to create:')
  console.log(JSON.stringify({
    username: 'admin',
    email: 'admin@punjabijuttiandfulkari.com',
    password: hashedPassword,
    role: 'admin',
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }, null, 2))
}

generateHashedPassword()
