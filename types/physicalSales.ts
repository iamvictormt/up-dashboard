export type PhysicalSaleRedeemStatus = 'PENDING' | 'REDEEMED';

export interface PhysicalSale {
  id: string;
  code: string;
  customerName: string;
  sellerName?: string | null;
  invoice?: string | null;
  value: number;
  pointsAwarded: number;
  status: PhysicalSaleRedeemStatus;
  createdAt: string;
  redeemedAt?: string | null;
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
  value?: number;
}

export interface RedeemPhysicalSaleResponse {
  id: string;
  code: string;
  pointsAwarded: number;
  professionalId?: string;
  redeemedAt: string;
}
