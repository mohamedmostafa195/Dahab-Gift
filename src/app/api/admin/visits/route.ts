import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/storage';
import { logCustomerVisit, removeCustomerVisit } from '@/lib/loyalty';

export async function GET(req: NextRequest) {
  try {
    await db.syncFromCloud();
    const { searchParams } = new URL(req.url);
    const customerId = searchParams.get('customerId');

    let visits = customerId ? db.getVisitsByCustomerId(customerId) : db.getVisits();
    const customers = db.getCustomers();

    const visitsWithCustomers = visits.map((v) => {
      const cust = customers.find((c) => c.id === v.customerId);
      return {
        ...v,
        customerName: cust?.fullName || 'Guest Customer',
        customerPhone: cust?.phoneNumber || '',
        memberCode: cust?.memberCode || '',
      };
    });

    return NextResponse.json({
      visits: visitsWithCustomers,
      total: visitsWithCustomers.length,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to fetch visits' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    await db.syncFromCloud();
    const body = await req.json();
    const {
      customerId,
      customerPhone,
      customerName,
      memberCode,
      currentVisits,
      lifetimeVisits,
      currentCycle,
      tier,
      serviceName,
      barberName,
      price,
      notes,
    } = body;

    if (!customerId && !customerPhone && !memberCode) {
      return NextResponse.json(
        { error: 'Customer identifier is required' },
        { status: 400 }
      );
    }

    const result = logCustomerVisit({
      customerId: customerId || customerPhone || memberCode,
      customerPhone,
      customerName,
      memberCode,
      currentVisits: currentVisits !== undefined ? Number(currentVisits) : undefined,
      lifetimeVisits: lifetimeVisits !== undefined ? Number(lifetimeVisits) : undefined,
      currentCycle: currentCycle !== undefined ? Number(currentCycle) : undefined,
      tier,
      serviceName,
      barberName,
      price: price !== undefined ? Number(price) : undefined,
      notes,
    });

    await db.syncToCloud();

    return NextResponse.json(result, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to record visit' },
      { status: 400 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    await db.syncFromCloud();
    const { searchParams } = new URL(req.url);
    const visitId = searchParams.get('id');

    if (!visitId) {
      return NextResponse.json(
        { error: 'Visit ID is required' },
        { status: 400 }
      );
    }

    const result = removeCustomerVisit(visitId);
    await db.syncToCloud();
    return NextResponse.json(result, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to remove visit' },
      { status: 400 }
    );
  }
}

export async function PATCH(req: NextRequest) {
  try {
    await db.syncFromCloud();
    const body = await req.json();
    const { id, serviceName, barberName, price, notes } = body;

    if (!id) {
      return NextResponse.json(
        { error: 'Visit ID is required' },
        { status: 400 }
      );
    }

    const updated = db.updateVisit(id, {
      serviceName,
      barberName,
      price: price ? Number(price) : undefined,
      notes,
    });

    if (!updated) {
      return NextResponse.json({ error: 'Visit not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, visit: updated });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to update visit' },
      { status: 400 }
    );
  }
}
