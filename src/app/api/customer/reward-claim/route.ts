import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/storage';
import { requestCustomerRewardClaim } from '@/lib/loyalty';

export async function POST(req: NextRequest) {
  try {
    await db.syncFromCloud();
    const body = await req.json();
    const { rewardId, voucherCode, selectedService, selectedServicePrice } = body;

    const identifier = rewardId || voucherCode;
    if (!identifier) {
      return NextResponse.json(
        { error: 'Reward ID or Voucher Code is required' },
        { status: 400 }
      );
    }

    if (!selectedService) {
      return NextResponse.json(
        { error: 'Please select a reward service' },
        { status: 400 }
      );
    }

    const result = requestCustomerRewardClaim(
      identifier,
      selectedService,
      Number(selectedServicePrice) || 0
    );

    return NextResponse.json(result, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to submit reward selection' },
      { status: 400 }
    );
  }
}
