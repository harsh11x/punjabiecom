import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import fs from 'fs';
import path from 'path';

export async function GET(req: NextRequest) {
  try {
    // Test MongoDB connection
    const dbConnection = await connectDB();
    
    // Test file system fallback
    const dataDir = path.join(process.cwd(), 'data');
    const ordersDir = path.join(dataDir, 'orders');
    const fsAccessible = fs.existsSync(dataDir) && fs.existsSync(ordersDir);
    
    // Create a test fallback order
    const testOrderId = `fallback-test-${Date.now()}`;
    const testOrder = {
      _id: testOrderId,
      orderNumber: `TEST-${Date.now()}`,
      items: [{ name: 'Test Item', price: 100, quantity: 1 }],
      total: 100,
      status: 'test',
      createdAt: new Date().toISOString()
    };
    
    let fallbackWriteSuccess = false;
    
    if (fsAccessible) {
      try {
        fs.writeFileSync(
          path.join(ordersDir, `${testOrderId}.json`),
          JSON.stringify(testOrder, null, 2)
        );
        fallbackWriteSuccess = true;
      } catch (fsError) {
        console.error('Failed to write test fallback order:', fsError);
      }
    }
    
    return NextResponse.json({
      success: true,
      mongoDbConnected: !!dbConnection,
      fallbackMechanism: {
        dataDirectoryExists: fs.existsSync(dataDir),
        ordersDirectoryExists: fs.existsSync(ordersDir),
        testOrderWriteSuccess: fallbackWriteSuccess
      }
    });
  } catch (error: any) {
    console.error('Test fallback error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error.message || 'Test fallback failed',
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
      },
      { status: 500 }
    );
  }
}