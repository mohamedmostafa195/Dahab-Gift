import { db } from './storage';
import { Customer, Visit, Reward, LoyaltyRule } from '@/types';

function generateRandomCode(prefix: string = 'DHB-RWD'): string {
  const num = Math.floor(1000 + Math.random() * 9000);
  return `${prefix}-${num}`;
}

export function calculateTier(lifetimeVisits: number): Customer['tier'] {
  if (lifetimeVisits >= 12) return 'ROYAL VIP';
  if (lifetimeVisits >= 6) return 'GOLD';
  if (lifetimeVisits >= 3) return 'SILVER';
  return 'BRONZE';
}

export interface AddVisitResult {
  success: boolean;
  visit: Visit;
  customer: Customer;
  rewardEarned?: Reward;
  isRewardUnlocked: boolean;
  message: string;
}

export function logCustomerVisit(params: {
  customerId: string;
  serviceName?: string;
  barberName?: string;
  price?: number;
  notes?: string;
}): AddVisitResult {
  const customer = db.getCustomerById(params.customerId);
  if (!customer) {
    throw new Error('Customer not found');
  }

  const rule = db.getLoyaltyRule();
  const target = rule.targetVisits || 5;

  const newCurrentVisits = customer.currentVisits + 1;
  const newLifetimeVisits = customer.lifetimeVisits + 1;
  const now = new Date().toISOString();

  // Create Visit
  const visit: Visit = {
    id: `vis-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    customerId: customer.id,
    cycleNumber: customer.currentCycle,
    visitIndexInCycle: newCurrentVisits,
    serviceName: params.serviceName || 'Dahab Signature Haircut',
    barberName: params.barberName || 'Tarek "The Master" El-Sayed',
    price: params.price !== undefined ? params.price : 350,
    notes: params.notes,
    createdAt: now,
  };

  db.createVisit(visit);

  let rewardEarned: Reward | undefined = undefined;
  let isRewardUnlocked = false;

  // Check if target is achieved
  if (newCurrentVisits >= target) {
    isRewardUnlocked = true;
    const voucherCode = generateRandomCode('DHB-RWD');
    rewardEarned = {
      id: `rwd-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      customerId: customer.id,
      customerName: customer.fullName,
      customerPhone: customer.phoneNumber,
      voucherCode,
      title: rule.rewardTitle || 'Free Signature Haircut',
      description: `Cycle ${customer.currentCycle} Reward: ${rule.rewardDesc}`,
      cycleNumber: customer.currentCycle,
      status: 'AVAILABLE',
      earnedAt: now,
    };
    db.createReward(rewardEarned);
  }

  const newTier = calculateTier(newLifetimeVisits);

  const updatedCustomer = db.updateCustomer(customer.id, {
    currentVisits: newCurrentVisits,
    lifetimeVisits: newLifetimeVisits,
    tier: newTier,
    lastVisitDate: now,
  });

  return {
    success: true,
    visit,
    customer: updatedCustomer || customer,
    rewardEarned,
    isRewardUnlocked,
    message: isRewardUnlocked
      ? `Congratulations! ${customer.fullName} completed ${target} visits and earned ${rule.rewardTitle}!`
      : `Visit recorded successfully (${newCurrentVisits}/${target} stamps).`,
  };
}

export function redeemCustomerReward(rewardIdOrCode: string, redeemedBy: string = 'Admin') {
  let reward = db.getRewardById(rewardIdOrCode);
  if (!reward) {
    reward = db.getRewardByCode(rewardIdOrCode);
  }

  if (!reward) {
    throw new Error('Reward voucher not found');
  }

  if (reward.status === 'REDEEMED') {
    throw new Error('This reward has already been redeemed.');
  }

  const customer = db.getCustomerById(reward.customerId);
  if (!customer) {
    throw new Error('Customer linked to this reward was not found.');
  }

  const now = new Date().toISOString();

  // Mark reward as redeemed
  const updatedReward = db.updateReward(reward.id, {
    status: 'REDEEMED',
    redeemedAt: now,
    redeemedBy,
  });

  const rule = db.getLoyaltyRule();
  const target = rule.targetVisits || 5;

  // Advance to next cycle & reset stamp count
  const newCycle = customer.currentCycle + 1;
  const newCurrentVisits = Math.max(0, customer.currentVisits - target);

  const updatedCustomer = db.updateCustomer(customer.id, {
    currentCycle: newCycle,
    currentVisits: newCurrentVisits,
    tier: calculateTier(customer.lifetimeVisits),
  });

  return {
    success: true,
    reward: updatedReward,
    customer: updatedCustomer,
    message: `Reward "${reward.title}" redeemed successfully! Cycle ${newCycle} has begun with ${newCurrentVisits}/${target} stamps.`,
  };
}

export function removeCustomerVisit(visitId: string) {
  const visit = db.getVisitById(visitId);
  if (!visit) {
    throw new Error('Visit not found');
  }

  const customer = db.getCustomerById(visit.customerId);
  if (!customer) {
    throw new Error('Customer not found');
  }

  // Check if a reward was earned at this exact cycle visit count
  const unredeemedRewards = db
    .getRewardsByCustomerId(customer.id)
    .filter((r) => r.cycleNumber === visit.cycleNumber && r.status === 'AVAILABLE');

  // If deleting the 5th visit that created an unredeemed reward, void that unredeemed reward
  if (unredeemedRewards.length > 0 && customer.currentVisits >= 5) {
    const latestReward = unredeemedRewards[0];
    db.updateReward(latestReward.id, {
      status: 'EXPIRED',
    });
  }

  const newCurrentVisits = Math.max(0, customer.currentVisits - 1);
  const newLifetimeVisits = Math.max(0, customer.lifetimeVisits - 1);

  db.deleteVisit(visitId);

  const updatedCustomer = db.updateCustomer(customer.id, {
    currentVisits: newCurrentVisits,
    lifetimeVisits: newLifetimeVisits,
    tier: calculateTier(newLifetimeVisits),
  });

  return {
    success: true,
    customer: updatedCustomer,
    message: 'Visit removed and customer stamp counter adjusted.',
  };
}
