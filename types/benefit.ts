export interface BenefitData {
  id: string;
  name: string;
  description: string;
  pointsCost: number;
  quantity: number | null;
  imageUrl?: string;
  isActive: boolean;
  expiresAt?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface BenefitRedemptionData {
  id: string;
  benefitId: string;
  userId: string;
  status: 'PENDING' | 'USED' | 'CANCELED' | 'EXPIRED';
  redeemedAt: string;
  usedAt?: string | null;
  expiresAt?: string | null;
  benefit: BenefitData;
}
