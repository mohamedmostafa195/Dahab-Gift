import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/storage';

export async function GET(req: NextRequest) {
  try {
    await db.syncFromCloud();
    const { searchParams } = new URL(req.url);
    const phone = searchParams.get('phone');
    const customerId = searchParams.get('customerId');
    const memberCode = searchParams.get('memberCode');

    let customer = null;
    if (customerId) {
      customer = db.getCustomerById(customerId);
    } else if (phone) {
      customer = db.getCustomerByPhone(phone);
    } else if (memberCode) {
      customer = db.getCustomerByMemberCode(memberCode);
    }

    if (!customer) {
      return NextResponse.json(
        { error: 'Customer not found' },
        { status: 404 }
      );
    }

    const rule = db.getLoyaltyRule();
    const visits = db.getVisitsByCustomerId(customer.id);
    const rewards = db.getRewardsByCustomerId(customer.id);

    const targetVisits = rule.targetVisits || 5;
    const remainingToReward = Math.max(0, targetVisits - customer.currentVisits);
    const progressPercent = Math.min(
      100,
      Math.round((customer.currentVisits / targetVisits) * 100)
    );

    const activeRewards = rewards.filter(
      (r) => r.status === 'AVAILABLE' || r.status === 'PENDING_APPROVAL' || r.status === 'REJECTED'
    );
    const pastRewards = rewards.filter(
      (r) => r.status === 'REDEEMED' || r.status === 'EXPIRED'
    );

    return NextResponse.json({
      customer,
      rule,
      targetVisits,
      currentVisits: customer.currentVisits,
      remainingToReward,
      progressPercent,
      activeRewards,
      pastRewards,
      visits,
      barbers: db.getBarbers(),
      services: db.getServices(),
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to fetch customer profile' },
      { status: 500 }
    );
  }
}
