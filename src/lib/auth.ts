import { db } from './storage';
import { User, Customer, UserRole } from '@/types';
import { calculateTier } from './loyalty';

export interface AuthSession {
  userId: string;
  phoneNumber: string;
  fullName: string;
  role: UserRole;
  customerId?: string;
  memberCode?: string;
}

export function registerCustomer(params: {
  fullName: string;
  phoneNumber: string;
  email?: string;
  password?: string;
}): { success: boolean; user: User; customer: Customer; message?: string } {
  const cleanPhone = (params.phoneNumber || '').trim().replace(/\s+/g, '');
  const cleanName = (params.fullName || '').trim();
  const cleanEmail = (params.email || '').trim().toLowerCase();
  const cleanPass = (params.password || '').trim();

  if (!cleanName) {
    throw new Error('الاسم بالكامل مطلوب');
  }
  if (!cleanPhone) {
    throw new Error('رقم الهاتف مطلوب');
  }
  if (!cleanPass) {
    throw new Error('كلمة المرور مطلوبة');
  }
  if (cleanPass.length < 4) {
    throw new Error('كلمة المرور يجب ألا تقل عن 4 خانات');
  }

  const existingUser = db.getUserByPhone(cleanPhone);
  const existingCustomer = db.getCustomerByPhone(cleanPhone);

  if (existingUser || existingCustomer) {
    throw new Error('رقم الهاتف مسجل بالفعل! يرجى تسجيل الدخول أو استخدام رقم آخر.');
  }

  if (cleanEmail) {
    const existingEmailUser = db.getUsers().find(
      (u) => u.email && u.email.toLowerCase() === cleanEmail
    );
    if (existingEmailUser) {
      throw new Error('البريد الإلكتروني مسجل بالفعل بحساب آخر.');
    }
  }

  const now = new Date().toISOString();
  const userId = `user-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

  const user: User = {
    id: userId,
    phoneNumber: cleanPhone,
    fullName: cleanName,
    email: cleanEmail,
    role: 'CUSTOMER',
    passwordHash: cleanPass,
    createdAt: now,
  };
  db.createUser(user);

  // Generate unique member code like DHB-4821
  const randomSuffix = Math.floor(1000 + Math.random() * 9000);
  const memberCode = `DHB-${randomSuffix}`;

  const customer: Customer = {
    id: `cust-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    userId: user.id,
    fullName: user.fullName,
    phoneNumber: cleanPhone,
    email: user.email,
    memberCode,
    currentCycle: 1,
    currentVisits: 0,
    lifetimeVisits: 0,
    tier: calculateTier(0),
    createdAt: now,
    updatedAt: now,
  };
  db.createCustomer(customer);

  return {
    success: true,
    user,
    customer,
    message: 'Registration successful! Welcome to Dahab VIP Club.',
  };
}

export function loginCustomer(params: {
  phoneNumber: string;
  passwordOrPin?: string;
}): { success: boolean; user: User; customer: Customer } {
  const cleanPhone = (params.phoneNumber || '').trim().replace(/\s+/g, '');
  if (!cleanPhone) {
    throw new Error('رقم الهاتف أو البريد الإلكتروني مطلوب');
  }

  const inputPass = (params.passwordOrPin || '').trim();
  if (!inputPass) {
    throw new Error('يرجى إدخال كلمة المرور');
  }

  let user = db.getUserByPhone(cleanPhone);
  if (!user && cleanPhone.includes('@')) {
    user = db.getUsers().find((u) => u.email?.toLowerCase() === cleanPhone.toLowerCase());
  }

  let customer = user ? db.getCustomerByUserId(user.id) : db.getCustomerByPhone(cleanPhone);

  if (!user && !customer) {
    throw new Error('رقم الهاتف أو البريد الإلكتروني غير مسجل. يرجى إنشاء حساب جديد أولاً.');
  }

  if (user && !customer) {
    customer = db.getCustomerByUserId(user.id);
  }

  if (!customer && user) {
    const memberCode = `DHB-${Math.floor(1000 + Math.random() * 9000)}`;
    customer = db.createCustomer({
      id: `cust-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      userId: user.id,
      fullName: user.fullName,
      phoneNumber: user.phoneNumber,
      email: user.email,
      memberCode,
      currentCycle: 1,
      currentVisits: 0,
      lifetimeVisits: 0,
      tier: 'BRONZE',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
  }

  if (!user && customer) {
    user = {
      id: customer.userId || `user-${Date.now()}`,
      phoneNumber: customer.phoneNumber,
      fullName: customer.fullName,
      role: 'CUSTOMER',
      passwordHash: '123456',
      createdAt: customer.createdAt,
    };
  }

  // Password verification
  if (user && user.passwordHash) {
    if (user.passwordHash !== inputPass) {
      throw new Error('كلمة المرور غير صحيحة');
    }
  }

  return {
    success: true,
    user: user!,
    customer: customer!,
  };
}

export function loginAdmin(params: {
  identifier: string; // phone or email or 'admin'
  passwordOrPin: string;
}): { success: boolean; user: User } {
  const clean = params.identifier.trim().toLowerCase();
  const pass = params.passwordOrPin.trim();

  // Check admin users
  const users = db.getUsers();
  const adminUser = users.find(
    (u) =>
      u.role === 'ADMIN' &&
      (u.phoneNumber === clean ||
        u.email?.toLowerCase() === clean ||
        clean === 'admin' ||
        clean === 'admin@dahab.com')
  );

  // Allow standard demo admin passwords / PINs: '1234', 'admin123', 'admin'
  if (
    adminUser &&
    (adminUser.passwordHash === pass || pass === '1234' || pass === 'admin123' || pass === 'admin')
  ) {
    return {
      success: true,
      user: adminUser,
    };
  }

  if (pass === '1234' || pass === 'admin123') {
    // Fallback default admin session
    return {
      success: true,
      user: {
        id: 'user-admin',
        phoneNumber: '01000000000',
        fullName: 'Dahab Master Admin',
        email: 'admin@dahabbarbershop.com',
        role: 'ADMIN',
        createdAt: new Date().toISOString(),
      },
    };
  }

  throw new Error('Invalid Admin credentials or PIN');
}
