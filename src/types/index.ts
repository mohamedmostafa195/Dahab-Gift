export type UserRole = 'CUSTOMER' | 'BARBER' | 'ADMIN';

export type RewardStatus = 'AVAILABLE' | 'REDEEMED' | 'EXPIRED';

export interface User {
  id: string;
  phoneNumber: string;
  fullName: string;
  email?: string;
  role: UserRole;
  passwordHash?: string;
  createdAt: string;
}

export interface Customer {
  id: string;
  userId: string;
  fullName: string;
  phoneNumber: string;
  email?: string;
  memberCode: string; // e.g., DHB-4819
  currentCycle: number; // e.g. 1, 2, 3...
  currentVisits: number; // e.g. 0 to 5 in current cycle
  lifetimeVisits: number; // Total visits ever
  tier: 'BRONZE' | 'SILVER' | 'GOLD' | 'ROYAL VIP';
  notes?: string;
  createdAt: string;
  updatedAt: string;
  lastVisitDate?: string;
}

export interface Visit {
  id: string;
  customerId: string;
  cycleNumber: number;
  visitIndexInCycle: number; // 1 to targetVisits (e.g. 4)
  serviceName: string; // e.g., "Signature Haircut", "Haircut & Beard Sculpt", "VIP Royal Grooming"
  barberName?: string;
  price?: number;
  notes?: string;
  createdAt: string;
}

export interface Reward {
  id: string;
  customerId: string;
  customerName?: string;
  customerPhone?: string;
  voucherCode: string; // e.g. RWD-GOLD-9821
  title: string; // e.g., "Free Haircut", "20% Discount"
  description: string;
  cycleNumber: number;
  status: RewardStatus;
  earnedAt: string;
  redeemedAt?: string;
  redeemedBy?: string;
}

export interface LoyaltyRule {
  id: string;
  targetVisits: number; // default: 5
  rewardTitle: string; // default: "Free Haircut"
  rewardDesc: string; // default: "Enjoy a complimentary signature haircut & hot towel finish on us."
  shopName: string; // "Dahab Grooming Lounge"
  phonePrefix: string; // "+20" or local
  isActive: boolean;
  updatedAt: string;
}

export interface Barber {
  id: string;
  name: string;
  role: string;
  avatar: string;
  specialty: string;
  rating: number;
}

export interface ServiceItem {
  id: string;
  name: string;
  category: 'HAIRCUT' | 'BEARD' | 'TREATMENT' | 'PACKAGE';
  duration: string;
  price: number;
  description: string;
  icon?: string;
  popular?: boolean;
}

export interface AnalyticsData {
  totalCustomers: number;
  totalVisits: number;
  visitsThisMonth: number;
  newCustomersThisMonth: number;
  activeLoyaltyMembers: number;
  rewardsEarned: number;
  rewardsRedeemed: number;
  redemptionRate: number;
  recentVisits: (Visit & { customerName: string; customerPhone: string })[];
  monthlyVisits: { month: string; visits: number; newUsers: number }[];
  popularServices: { name: string; count: number }[];
  barberPerformance: { name: string; visits: number }[];
}
