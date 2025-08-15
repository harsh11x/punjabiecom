#!/usr/bin/env node

/**
 * Script to manually revalidate Next.js cache
 * Usage: node scripts/revalidate-cache.js [path]
 */

const https = require('https')
const http = require('http')

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'
const REVALIDATE_SECRET = process.env.REVALIDATE_SECRET || 'punjabi-heritage-revalidate'

function makeRequest(url) {
  return new Promise((resolve, reject) => {
    const isHttps = url.startsWith('https')
    const client = isHttps ? https : http
    
    const req = client.request(url, { method: 'POST' }, (res) => {
      let data = ''
      res.on('data', chunk => data += chunk)
      res.on('end', () => {
        try {
          const result = JSON.parse(data)
          resolve({ status: res.statusCode, data: result })
        } catch (e) {
          resolve({ status: res.statusCode, data: data })
        }
      })
    })
    
    req.on('error', reject)
    req.end()
  })
}

async function revalidateCache(path = null) {
  try {
    let url = `${BASE_URL}/api/revalidate?secret=${REVALIDATE_SECRET}`
    if (path) {
      url += `&path=${encodeURIComponent(path)}`
    }
    
    console.log(`Revalidating cache${path ? ` for path: ${path}` : ' for all product pages'}...`)
    console.log(`URL: ${url}`)
    
    const result = await makeRequest(url)
    
    if (result.status === 200) {
      console.log('✅ Cache revalidated successfully!')
      console.log('Response:', result.data)
    } else {
      console.log('❌ Failed to revalidate cache')
      console.log('Status:', result.status)
      console.log('Response:', result.data)
    }
  } catch (error) {
    console.error('❌ Error revalidating cache:', error.message)
  }
}

// Get path from command line arguments
const path = process.argv[2]
revalidateCache(path)
