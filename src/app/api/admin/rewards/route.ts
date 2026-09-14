import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/storage';
import { redeemCustomerReward, rejectCustomerRewardClaim } from '@/lib/loyalty';

export async function GET(req: NextRequest) {
  try {
    await db.syncFromCloud();
    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status'); // ALL | AVAILABLE | PENDING_APPROVAL | REDEEMED | REJECTED
    const customerId = searchParams.get('customerId');

    let rewards = db.getRewards();
    const customers = db.getCustomers();

    if (customerId) {
      rewards = rewards.filter((r) => r.customerId === customerId);
    }

    if (status && status !== 'ALL') {
      if (status === 'AVAILABLE') {
        rewards = rewards.filter((r) => r.status === 'AVAILABLE' || r.status === 'PENDING_APPROVAL');
      } else {
        rewards = rewards.filter((r) => r.status === status);
      }
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

    const allRewards = db.getRewards();

    return NextResponse.json({
      rewards: rewardsWithCustomer,
      total: rewardsWithCustomer.length,
      availableCount: allRewards.filter((r) => r.status === 'AVAILABLE').length,
      pendingCount: allRewards.filter((r) => r.status === 'PENDING_APPROVAL').length,
      redeemedCount: allRewards.filter((r) => r.status === 'REDEEMED').length,
      rejectedCount: allRewards.filter((r) => r.status === 'REJECTED').length,
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
    const { rewardIdOrCode, redeemedBy, action, rejectionReason } = body;

    if (!rewardIdOrCode) {
      return NextResponse.json(
        { error: 'Reward ID or Voucher Code is required' },
        { status: 400 }
      );
    }

    if (action === 'REJECT') {
      const result = rejectCustomerRewardClaim(rewardIdOrCode, rejectionReason);
      await db.syncToCloud();
      return NextResponse.json(result, { status: 200 });
    }

    // Default or action === 'APPROVE' or 'REDEEM'
    const result = redeemCustomerReward(rewardIdOrCode, redeemedBy || 'Admin');
    await db.syncToCloud();
    return NextResponse.json(result, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to process reward request' },
      { status: 400 }
    );
  }
}
