import { NextResponse } from 'next/server';
import { db } from '@/lib/storage';

export async function GET() {
  try {
    await db.syncFromCloud();
    const cloudStatus = db.getCloudStatus();
    const customers = db.getCustomers();
    const visits = db.getVisits();
    const rewards = db.getRewards();

    return NextResponse.json({
      status: 'ok',
      cloud: cloudStatus,
      stats: {
        totalCustomers: customers.length,
        totalVisits: visits.length,
        totalRewards: rewards.length,
      },
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Status check failed' },
      { status: 500 }
    );
  }
}
