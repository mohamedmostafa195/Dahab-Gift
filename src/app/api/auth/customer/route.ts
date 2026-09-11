import { NextRequest, NextResponse } from 'next/server';
import { registerCustomer, loginCustomer } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { action, fullName, phoneNumber, password, email } = body;

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

      return NextResponse.json(res, { status: 201 });
    } else if (action === 'login') {
      if (!phoneNumber) {
        return NextResponse.json(
          { error: 'Phone Number is required' },
          { status: 400 }
        );
      }

      const res = loginCustomer({
        phoneNumber,
        passwordOrPin: password,
      });

      return NextResponse.json(res, { status: 200 });
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Authentication failed' },
      { status: 400 }
    );
  }
}
