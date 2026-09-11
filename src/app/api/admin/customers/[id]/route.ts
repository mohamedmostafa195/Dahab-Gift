import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/storage';

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ id: string }> | { id: string } }
) {
  try {
    const resolvedParams = await Promise.resolve(context.params);
    let rawId = decodeURIComponent(resolvedParams.id || '').trim();

    // If id is JSON string (e.g. from QR code directly)
    let parsedIdentifier = rawId;
    try {
      if (rawId.startsWith('{') && rawId.endsWith('}')) {
        const parsed = JSON.parse(rawId);
        parsedIdentifier = parsed.memberCode || parsed.phone || parsed.id || parsedIdentifier;
      }
    } catch (e) {
      // not JSON, continue
    }

    const cleanInput = parsedIdentifier.trim();
    const cleanPhone = cleanInput.replace(/[\s\-\+]/g, '');

    const customers = db.getCustomers();
    let customer = customers.find((c) => {
      const cPhoneClean = c.phoneNumber.replace(/[\s\-\+]/g, '');
      return (
        c.id === cleanInput ||
        c.memberCode.toUpperCase() === cleanInput.toUpperCase() ||
        c.phoneNumber === cleanInput ||
        cPhoneClean === cleanPhone ||
        (cPhoneClean.endsWith(cleanPhone) && cleanPhone.length >= 8) ||
        (cleanPhone.endsWith(cPhoneClean) && cPhoneClean.length >= 8) ||
        (c.email && c.email.toLowerCase() === cleanInput.toLowerCase()) ||
        c.userId === cleanInput
      );
    });

    if (!customer) {
      return NextResponse.json({ error: 'Customer not found with this QR pass or Phone Number' }, { status: 404 });
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
