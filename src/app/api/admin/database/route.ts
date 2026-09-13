import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/storage';

export async function GET() {
  try {
    await db.syncFromCloud();
    const database = db.getDatabase();
    return NextResponse.json(database);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to export database' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    if (!body || typeof body !== 'object') {
      return NextResponse.json(
        { error: 'Invalid database payload' },
        { status: 400 }
      );
    }

    const updated = await db.importDatabase(body);

    return NextResponse.json({
      success: true,
      message: 'Database imported and synchronized successfully!',
      stats: {
        customers: updated.customers.length,
        visits: updated.visits.length,
        rewards: updated.rewards.length,
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to import database' },
      { status: 400 }
    );
  }
}
