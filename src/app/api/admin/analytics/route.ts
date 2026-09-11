import { NextResponse } from 'next/server';
import { db } from '@/lib/storage';

export async function GET() {
  try {
    const analytics = db.getAnalytics();
    return NextResponse.json(analytics);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to fetch analytics' },
      { status: 500 }
    );
  }
}
