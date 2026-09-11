import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/storage';

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ id: string }> | { id: string } }
) {
  try {
    const resolvedParams = await Promise.resolve(context.params);
    const { id } = resolvedParams;

    let customer = db.getCustomerById(id);
    if (!customer) {
      customer = db.getCustomerByPhone(id);
    }
    if (!customer) {
      customer = db.getCustomerByMemberCode(id);
    }

    if (!customer) {
      return NextResponse.json({ error: 'Customer not found' }, { status: 404 });
    }

    const rule = db.getLoyaltyRule();
    const visits = db.getVisitsByCustomerId(customer.id);
    const rewards = db.getRewardsByCustomerId(customer.id);

    return NextResponse.json({
      customer,
      rule,
      targetVisits: rule.targetVisits,
      currentVisits: customer.currentVisits,
      lifetimeVisits: customer.lifetimeVisits,
      currentCycle: customer.currentCycle,
      visits,
      rewards,
      availableRewards: rewards.filter((r) => r.status === 'AVAILABLE'),
      redeemedRewards: rewards.filter((r) => r.status === 'REDEEMED'),
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to fetch customer profile' },
      { status: 500 }
    );
  }
}

export async function PATCH(
  req: NextRequest,
  context: { params: Promise<{ id: string }> | { id: string } }
) {
  try {
    const resolvedParams = await Promise.resolve(context.params);
    const { id } = resolvedParams;
    const body = await req.json();

    const updated = db.updateCustomer(id, body);
    if (!updated) {
      return NextResponse.json({ error: 'Customer not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, customer: updated });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to update customer' },
      { status: 500 }
    );
  }
}
