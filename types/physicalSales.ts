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
  message: string;
  code: string;
  points: number;
}

export interface RedeemPhysicalSaleResponse {
  message: string;
  points: number;
}
