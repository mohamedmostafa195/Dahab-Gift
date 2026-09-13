import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/storage';
import { registerCustomer, loginCustomer, loginAdmin } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    await db.syncFromCloud();
    const body = await req.json();
    const { action, fullName, phoneNumber, identifier, password, email } = body;

    if (action === 'register') {
      if (!fullName?.trim()) {
        return NextResponse.json(
          { error: 'الاسم بالكامل مطلوب' },
          { status: 400 }
        );
      }
      if (!phoneNumber?.trim()) {
        return NextResponse.json(
          { error: 'رقم الهاتف مطلوب' },
          { status: 400 }
        );
      }
      if (!password?.trim()) {
        return NextResponse.json(
          { error: 'كلمة المرور مطلوبة' },
          { status: 400 }
        );
      }

      const res = registerCustomer({
        fullName: fullName.trim(),
        phoneNumber: phoneNumber.trim(),
        email: email?.trim(),
        password: password.trim(),
      });

      return NextResponse.json({ ...res, role: 'CUSTOMER' }, { status: 201 });
    } else if (action === 'login' || !action) {
      const loginId = (identifier || phoneNumber || '').trim();
      if (!loginId) {
        return NextResponse.json(
          { error: 'رقم الهاتف أو البريد الإلكتروني مطلوب' },
          { status: 400 }
        );
      }
      if (!password?.trim()) {
        return NextResponse.json(
          { error: 'كلمة المرور مطلوبة' },
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
            { error: err.message || 'بيانات الدخول غير صحيحة' },
            { status: 401 }
          );
        }
      }

      const res = loginCustomer({
        phoneNumber: loginId,
        passwordOrPin: password.trim(),
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
