const fs = require('fs')
const path = require('path')
const bcrypt = require('bcryptjs')

const DATA_DIR = path.resolve(process.cwd(), 'data')
const USERS_FILE = path.join(DATA_DIR, 'users.json')

async function createAdminUser() {
  try {
    // Ensure data directory exists
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true })
    }

    // Check if users file exists, create if not
    let usersData = { version: 1, users: [] }
    if (fs.existsSync(USERS_FILE)) {
      const fileContent = fs.readFileSync(USERS_FILE, 'utf8')
      usersData = JSON.parse(fileContent)
    }

    // Check if admin already exists
    const existingAdmin = usersData.users.find(user => user.email === 'admin@punjabiecom.com')
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
      name: 'Admin',
      email: 'admin@punjabiecom.com',
      passwordHash,
      phone: '+91 98765 43210',
      role: 'admin',
      isVerified: true,
      createdAt: now,
      updatedAt: now
    }

    // Add admin to users array
    usersData.users.push(adminUser)

    // Write back to file
    fs.writeFileSync(USERS_FILE, JSON.stringify(usersData, null, 2), 'utf8')

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
