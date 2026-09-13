import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/storage';
import { Customer } from '@/types';

export async function POST(req: NextRequest) {
  try {
    await db.syncFromCloud();
    const body = await req.json();
    const { customer } = body;

    if (!customer || !customer.phoneNumber) {
      return NextResponse.json(
        { error: 'Customer phone number is required' },
        { status: 400 }
      );
    }

    const cleanPhone = (customer.phoneNumber || '').trim().replace(/[\s\-\+]/g, '');
    let existing = db.getCustomerByPhone(cleanPhone) || db.getCustomerById(customer.id);

    if (!existing) {
      const now = new Date().toISOString();
      existing = db.createCustomer({
        id: customer.id || `cust-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
        userId: customer.userId || `user-${Date.now()}`,
        fullName: customer.fullName || `Customer ${cleanPhone.slice(-4)}`,
        phoneNumber: cleanPhone,
        email: customer.email,
        memberCode: customer.memberCode || `DHB-${Math.floor(1000 + Math.random() * 9000)}`,
        currentCycle: customer.currentCycle || 1,
        currentVisits: customer.currentVisits !== undefined ? customer.currentVisits : 0,
        lifetimeVisits: customer.lifetimeVisits !== undefined ? customer.lifetimeVisits : 0,
        tier: customer.tier || 'BRONZE',
        createdAt: customer.createdAt || now,
        updatedAt: now,
      });

      // Also ensure customer user exists
      const existingUser = db.getUserByPhone(cleanPhone);
      if (!existingUser) {
        db.createUser({
          id: existing.userId || `user-${Date.now()}`,
          phoneNumber: cleanPhone,
          fullName: existing.fullName,
          email: existing.email,
          role: 'CUSTOMER',
          createdAt: now,
        });
      }

      await db.syncToCloud();
    }

    return NextResponse.json({
      success: true,
      customer: existing,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Sync failed' },
      { status: 400 }
    );
  }
}
