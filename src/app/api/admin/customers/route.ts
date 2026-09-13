import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/storage';
import { registerCustomer } from '@/lib/auth';

export async function GET(req: NextRequest) {
  try {
    await db.syncFromCloud();
    const { searchParams } = new URL(req.url);
    const search = searchParams.get('search')?.toLowerCase() || '';
    const filter = searchParams.get('filter') || 'all'; // all, reward-ready, active, new

    const rule = db.getLoyaltyRule();
    let customers = db.getCustomers();
    const rewards = db.getRewards();

    if (search) {
      customers = customers.filter(
        (c) =>
          c.fullName.toLowerCase().includes(search) ||
          c.phoneNumber.includes(search) ||
          c.memberCode.toLowerCase().includes(search)
      );
    }

    if (filter === 'reward-ready') {
      customers = customers.filter((c) => {
        const hasUnredeemedReward = rewards.some(
          (r) => r.customerId === c.id && r.status === 'AVAILABLE'
        );
        return c.currentVisits >= rule.targetVisits || hasUnredeemedReward;
      });
    } else if (filter === 'active') {
      customers = customers.filter((c) => c.currentVisits > 0);
    }

    const customersWithDetails = customers.map((c) => {
      const custRewards = rewards.filter((r) => r.customerId === c.id);
      const availableRewards = custRewards.filter((r) => r.status === 'AVAILABLE');
      const currentVisits = Math.min(rule.targetVisits, c.currentVisits);
      return {
        ...c,
        currentVisits,
        availableRewardsCount: availableRewards.length,
        totalRewardsEarned: custRewards.length,
        targetVisits: rule.targetVisits,
        isReadyForReward: currentVisits >= rule.targetVisits || availableRewards.length > 0,
      };
    });

    return NextResponse.json({
      customers: customersWithDetails,
      total: customersWithDetails.length,
      rule,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to fetch customers' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    await db.syncFromCloud();
    const body = await req.json();
    const { fullName, phoneNumber, email, notes } = body;

    if (!fullName || !phoneNumber) {
      return NextResponse.json(
        { error: 'Full Name and Phone Number are required' },
        { status: 400 }
      );
    }

    const res = registerCustomer({
      fullName,
      phoneNumber,
      email,
    });

    if (notes) {
      db.updateCustomer(res.customer.id, { notes });
      res.customer.notes = notes;
    }

    await db.syncToCloud();

    return NextResponse.json(res, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to create customer' },
      { status: 400 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    await db.syncFromCloud();
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Customer ID is required' }, { status: 400 });
    }

    const deleted = db.deleteCustomer(id);
    if (!deleted) {
      return NextResponse.json({ error: 'Customer not found' }, { status: 404 });
    }

    await db.syncToCloud();

    return NextResponse.json({ success: true, message: 'Customer deleted successfully' });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to delete customer' },
      { status: 500 }
    );
  }
}
