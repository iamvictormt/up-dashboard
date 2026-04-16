export type PhysicalSaleRedeemStatus = 'PENDING' | 'REDEEMED';

export interface PhysicalSale {
  id: string;
  code: string;
  customerName: string;
  sellerName?: string | null;
  invoiceNumber?: string | null;
  saleAmount: number;
  pointsAwarded: number;
  status: PhysicalSaleRedeemStatus;
  createdAt: string;
  redeemedAt?: string | null;
  partnerSupplier?: {
    id: string;
    tradeName: string;
    type?: 'SUPPLIER' | 'WELLNESS';
  } | null;
  professional?: {
    id: string;
    email: string;
    name?: string | null;
  } | null;
}

export interface CreatePhysicalSalePayload {
  customerName: string;
  saleAmount: number;
  sellerName?: string;
  invoiceNumber?: string;
}

export interface CreatePhysicalSaleResponse {
  id: string;
  code: string;
  pointsAwarded: number;
  customerName: string;
  saleAmount?: number;
}

export interface RedeemPhysicalSalePayload {
  code: string;
}

export interface RedeemPhysicalSaleResponse {
  id: string;
  code: string;
  pointsAwarded: number;
  professionalId: string;
  redeemedAt: string;
}

export interface AdminDashboardStatistics {
  totalProfessionals: number;
  totalPartnerSuppliers: number;
  totalBenefitsRedeemed: number;
  totalPointsAwarded?: number;
  totalPhysicalSales: number;
  totalPointsAwardedPhysical: number;
}
