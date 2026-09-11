import { NextResponse } from 'next/server';
import { db } from '@/lib/storage';

export async function POST() {
  try {
    const data = db.resetToDefaults();
    return NextResponse.json({
      success: true,
      message: 'System reset to initial sample demo data with success.',
      customerCount: data.customers.length,
      visitCount: data.visits.length,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to reset data' },
      { status: 500 }
    );
  }
}
