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
    let jsonPayload: any = null;
    let parsedIdentifier = rawId;
    try {
      if (rawId.startsWith('{') && rawId.endsWith('}')) {
        jsonPayload = JSON.parse(rawId);
        parsedIdentifier = jsonPayload.memberCode || jsonPayload.phone || jsonPayload.code || jsonPayload.id || parsedIdentifier;
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

    // Auto-provision if scanning a member QR pass that exists on customer phone but not in current serverless instance
    if (!customer) {
      if (jsonPayload && (jsonPayload.phone || jsonPayload.memberCode || jsonPayload.code)) {
        const phone = (jsonPayload.phone || cleanPhone || '').trim();
        const memberCode = (jsonPayload.memberCode || jsonPayload.code || `DHB-${Math.floor(1000 + Math.random() * 9000)}`).trim();
        const fullName = (jsonPayload.name || jsonPayload.fullName || `Member ${phone.slice(-4)}`).trim();
        const now = new Date().toISOString();

        customer = db.createCustomer({
          id: `cust-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
          userId: `user-${Date.now()}`,
          fullName,
          phoneNumber: phone,
          email: jsonPayload.email,
          memberCode,
          currentCycle: 1,
          currentVisits: 0,
          lifetimeVisits: 0,
          tier: jsonPayload.tier || 'BRONZE',
          createdAt: now,
          updatedAt: now,
        });
      } else if (cleanPhone && cleanPhone.length >= 10 && /^01[0-2,5]{1}[0-9]{8}$/.test(cleanPhone)) {
        const now = new Date().toISOString();
        customer = db.createCustomer({
          id: `cust-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
          userId: `user-${Date.now()}`,
          fullName: `Member ${cleanPhone.slice(-4)}`,
          phoneNumber: cleanPhone,
          memberCode: `DHB-${Math.floor(1000 + Math.random() * 9000)}`,
          currentCycle: 1,
          currentVisits: 0,
          lifetimeVisits: 0,
          tier: 'BRONZE',
          createdAt: now,
          updatedAt: now,
        });
      }
    }

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

export async function DELETE(
  req: NextRequest,
  context: { params: Promise<{ id: string }> | { id: string } }
) {
  try {
    const resolvedParams = await Promise.resolve(context.params);
    const { id } = resolvedParams;

    const deleted = db.deleteCustomer(id);
    if (!deleted) {
      return NextResponse.json({ error: 'Customer not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: 'Customer deleted successfully' });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to delete customer' },
      { status: 500 }
    );
  }
}
