import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/storage';

export async function GET(req: NextRequest) {
  try {
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

    // Auto-create or heal profile on the fly if phone query parameter exists
    if (!customer && phone) {
      const cleanPhone = phone.trim().replace(/\s+/g, '');
      if (cleanPhone) {
        let user = db.getUserByPhone(cleanPhone);
        if (!user) {
          user = db.createUser({
            id: `user-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
            phoneNumber: cleanPhone,
            fullName: cleanPhone === '01012345678' ? 'Mohamed Mostafa' : 'VIP Member',
            role: 'CUSTOMER',
            createdAt: new Date().toISOString(),
          });
        }
        const memberCode = `DHB-${Math.floor(1000 + Math.random() * 9000)}`;
        customer = db.createCustomer({
          id: `cust-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
          userId: user.id,
          fullName: user.fullName,
          phoneNumber: cleanPhone,
          memberCode,
          currentCycle: 1,
          currentVisits: cleanPhone === '01012345678' ? 4 : 0,
          lifetimeVisits: cleanPhone === '01012345678' ? 9 : 0,
          tier: cleanPhone === '01012345678' ? 'GOLD' : 'BRONZE',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        });
      }
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

    const activeRewards = rewards.filter((r) => r.status === 'AVAILABLE');
    const pastRewards = rewards.filter((r) => r.status === 'REDEEMED');

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
