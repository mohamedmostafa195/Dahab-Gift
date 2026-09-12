import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/storage';
import { loginAdmin } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    await db.syncFromCloud();
    const body = await req.json();
    const { identifier, password } = body;

    if (!identifier || !password) {
      return NextResponse.json(
        { error: 'Identifier and Password/PIN are required' },
        { status: 400 }
      );
    }

    const res = loginAdmin({
      identifier,
      passwordOrPin: password,
    });

    return NextResponse.json(res, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Admin authentication failed' },
      { status: 401 }
    );
  }
}
