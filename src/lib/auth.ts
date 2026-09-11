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
  const cleanPhone = params.phoneNumber.trim().replace(/\s+/g, '');
  if (!cleanPhone) {
    throw new Error('Phone number is required');
  }

  const existingUser = db.getUserByPhone(cleanPhone);
  if (existingUser) {
    throw new Error('A member with this phone number already exists. Please log in.');
  }

  const now = new Date().toISOString();
  const userId = `user-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

  const user: User = {
    id: userId,
    phoneNumber: cleanPhone,
    fullName: params.fullName.trim(),
    email: params.email?.trim(),
    role: 'CUSTOMER',
    passwordHash: params.password || '123456',
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
  const cleanPhone = params.phoneNumber.trim().replace(/\s+/g, '');
  const user = db.getUserByPhone(cleanPhone);

  if (!user) {
    throw new Error('No account found with this phone number. Please register first.');
  }

  let customer = db.getCustomerByUserId(user.id);
  if (!customer) {
    customer = db.getCustomerByPhone(cleanPhone);
  }

  if (!customer) {
    // Auto-create customer profile if missing
    const memberCode = `DHB-${Math.floor(1000 + Math.random() * 9000)}`;
    customer = db.createCustomer({
      id: `cust-${Date.now()}`,
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

  return {
    success: true,
    user,
    customer,
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
