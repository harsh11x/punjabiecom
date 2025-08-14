const fs = require('fs')
const path = require('path')
const bcrypt = require('bcryptjs')

const DATA_DIR = path.resolve(process.cwd(), 'data')
const ADMINS_FILE = path.join(DATA_DIR, 'admins.json')

async function createAdminUser() {
  try {
    // Ensure data directory exists
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true })
    }

    // Check if admins file exists, create if not
    let adminsData = []
    if (fs.existsSync(ADMINS_FILE)) {
      const fileContent = fs.readFileSync(ADMINS_FILE, 'utf8')
      adminsData = JSON.parse(fileContent)
    }

    // Check if admin already exists
    const existingAdmin = adminsData.find(admin => admin.email === 'admin@punjabiecom.com')
    if (existingAdmin) {
      console.log('✅ Admin user already exists!')
      console.log('Email: admin@punjabiecom.com')
      console.log('Password: admin123')
      return
    }

    // Create admin user
    const passwordHash = await bcrypt.hash('admin123', 12)
    const now = new Date().toISOString()
    
    const adminUser = {
      id: 'admin_' + Date.now(),
      username: 'admin',
      email: 'admin@punjabiecom.com',
      password: passwordHash,
      role: 'super_admin',
      isActive: true,
      createdAt: now,
      updatedAt: now
    }

    // Add admin to array
    adminsData.push(adminUser)

    // Write back to file
    fs.writeFileSync(ADMINS_FILE, JSON.stringify(adminsData, null, 2), 'utf8')

    console.log('✅ Admin user created successfully!')
    console.log('Email: admin@punjabiecom.com')
    console.log('Password: admin123')
    console.log('\nYou can now access the admin panel at:')
    console.log('- Local: http://localhost:3000/admin')
    console.log('- Production: https://your-domain.vercel.app/admin')

  } catch (error) {
    console.error('❌ Error creating admin user:', error)
  }
}

createAdminUser()
