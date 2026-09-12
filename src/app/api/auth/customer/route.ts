import { NextRequest, NextResponse } from 'next/server';
import { registerCustomer, loginCustomer, loginAdmin } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { action, fullName, phoneNumber, identifier, password, email } = body;

    if (action === 'register') {
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
        password,
      });

      return NextResponse.json({ ...res, role: 'CUSTOMER' }, { status: 201 });
    } else if (action === 'login' || !action) {
      const loginId = (identifier || phoneNumber || '').trim();
      if (!loginId) {
        return NextResponse.json(
          { error: 'Phone Number or Email is required' },
          { status: 400 }
        );
      }

      const lower = loginId.toLowerCase();
      const isAdminAttempt =
        lower === 'admin' ||
        lower.includes('admin@') ||
        loginId === '01000000000';

      if (isAdminAttempt) {
        try {
          const adminRes = loginAdmin({
            identifier: loginId,
            passwordOrPin: password || '',
          });
          return NextResponse.json({
            success: true,
            role: 'ADMIN',
            user: adminRes.user,
          }, { status: 200 });
        } catch (err: any) {
          return NextResponse.json(
            { error: err.message || 'Invalid credentials' },
            { status: 401 }
          );
        }
      }

      const res = loginCustomer({
        phoneNumber: loginId,
        passwordOrPin: password,
      });

      return NextResponse.json({
        ...res,
        role: 'CUSTOMER',
      }, { status: 200 });
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Authentication failed' },
      { status: 400 }
    );
  }
}
