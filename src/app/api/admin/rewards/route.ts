import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/storage';
import { redeemCustomerReward } from '@/lib/loyalty';

export async function GET(req: NextRequest) {
  try {
    await db.syncFromCloud();
    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status'); // AVAILABLE | REDEEMED
    const customerId = searchParams.get('customerId');

    let rewards = db.getRewards();
    const customers = db.getCustomers();

    if (customerId) {
      rewards = rewards.filter((r) => r.customerId === customerId);
    }

    if (status) {
      rewards = rewards.filter((r) => r.status === status);
    }

    const rewardsWithCustomer = rewards.map((r) => {
      const cust = customers.find((c) => c.id === r.customerId);
      return {
        ...r,
        customerName: cust?.fullName || r.customerName || 'Loyal Member',
        customerPhone: cust?.phoneNumber || r.customerPhone || '',
        memberCode: cust?.memberCode || '',
      };
    });

    return NextResponse.json({
      rewards: rewardsWithCustomer,
      total: rewardsWithCustomer.length,
      availableCount: rewardsWithCustomer.filter((r) => r.status === 'AVAILABLE').length,
      redeemedCount: rewardsWithCustomer.filter((r) => r.status === 'REDEEMED').length,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to fetch rewards' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    await db.syncFromCloud();
    const body = await req.json();
    const { rewardIdOrCode, redeemedBy } = body;

    if (!rewardIdOrCode) {
      return NextResponse.json(
        { error: 'Reward ID or Voucher Code is required' },
        { status: 400 }
      );
    }

    const result = redeemCustomerReward(rewardIdOrCode, redeemedBy || 'Admin');
    return NextResponse.json(result, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to redeem reward' },
      { status: 400 }
    );
  }
}
