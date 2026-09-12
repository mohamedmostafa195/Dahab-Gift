import { User, Customer, Visit, Reward, LoyaltyRule, Barber, ServiceItem } from '@/types';

export const INITIAL_LOYALTY_RULE: LoyaltyRule = {
  id: 'rule-default-1',
  targetVisits: 5,
  rewardTitle: 'Free Signature Haircut',
  rewardDesc: 'Enjoy a complimentary signature haircut with refreshing hot towel finish.',
  shopName: 'DAHAB Grooming Lounge',
  phonePrefix: '+20',
  isActive: true,
  updatedAt: new Date().toISOString(),
};

export const INITIAL_BARBERS: Barber[] = [
  {
    id: 'barber-1',
    name: 'Tarek "The Master" El-Sayed',
    role: 'Head Stylist & Founder',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop&q=80',
    specialty: 'Classic Tapers, Scissor Fades & Royal Shaves',
    rating: 4.9,
  },
  {
    id: 'barber-2',
    name: 'Karim Mostafa',
    role: 'Senior Barber',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&auto=format&fit=crop&q=80',
    specialty: 'Beard Sculpting, Razor Lineups & Skin Fades',
    rating: 4.8,
  },
  {
    id: 'barber-3',
    name: 'Ziad Mansour',
    role: 'Precision Stylist',
    avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=300&auto=format&fit=crop&q=80',
    specialty: 'Modern Textured Crops & Hair Spa Treatments',
    rating: 4.9,
  },
  {
    id: 'barber-4',
    name: 'Omar Reda',
    role: 'Master Groomer',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&auto=format&fit=crop&q=80',
    specialty: 'Hot Towel Rituals & Charcoal Detox',
    rating: 4.7,
  },
];

export const INITIAL_SERVICES: ServiceItem[] = [
  {
    id: 'srv-1',
    name: 'Dahab Signature Haircut',
    category: 'HAIRCUT',
    duration: '40 min',
    price: 350,
    description: 'Precision cut, neck shave, invigorating wash, and styling with premium pomade.',
    popular: true,
  },
  {
    id: 'srv-2',
    name: 'Haircut + Royal Beard Sculpt',
    category: 'PACKAGE',
    duration: '60 min',
    price: 550,
    description: 'Signature haircut combined with hot towel steam beard trim and razor outline.',
    popular: true,
  },
  {
    id: 'srv-3',
    name: 'Royal Beard Sculpt & Hot Towel',
    category: 'BEARD',
    duration: '30 min',
    price: 250,
    description: 'Hot lather steam, straight razor edge lining, organic beard oil treatment.',
    popular: false,
  },
  {
    id: 'srv-4',
    name: 'Dahab VIP Ritual Experience',
    category: 'PACKAGE',
    duration: '80 min',
    price: 850,
    description: 'Haircut, beard sculpt, deep purifying charcoal facial, eye mask, and espresso.',
    popular: true,
  },
  {
    id: 'srv-5',
    name: 'Charcoal Face Detox & Scrub',
    category: 'TREATMENT',
    duration: '25 min',
    price: 220,
    description: 'Exfoliating black mask, steam extraction, and refreshing botanical toner.',
    popular: false,
  },
];

export const INITIAL_USERS: User[] = [
  {
    id: 'user-admin',
    phoneNumber: '01000000000',
    fullName: 'Dahab Admin Master',
    email: 'admin@dahabbarbershop.com',
    role: 'ADMIN',
    passwordHash: 'admin123',
    createdAt: '2026-01-01T10:00:00.000Z',
  },
];

export const INITIAL_CUSTOMERS: Customer[] = [];

export const INITIAL_VISITS: Visit[] = [];

export const INITIAL_REWARDS: Reward[] = [];

