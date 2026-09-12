import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/storage';

export async function GET() {
  try {
    const rule = db.getLoyaltyRule();
    const barbers = db.getBarbers();
    const services = db.getServices();
    return NextResponse.json({ rule, barbers, services });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to fetch settings' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { targetVisits, rewardTitle, rewardDesc, shopName, phonePrefix } = body;

    const updated = db.updateLoyaltyRule({
      targetVisits: targetVisits ? Number(targetVisits) : undefined,
      rewardTitle: rewardTitle?.trim(),
      rewardDesc: rewardDesc?.trim(),
      shopName: shopName?.trim(),
      phonePrefix: phonePrefix?.trim(),
    });

    return NextResponse.json({ success: true, rule: updated });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to update loyalty settings' },
      { status: 400 }
    );
  }
}
