export interface PhysicalSale {
  id: string;
  code: string;
  customerName: string;
  sellerName?: string | null;
  invoice?: string | null;
  value: number;
  points: number;
  createdAt: string;
  redeemedAt?: string | null;
  cancelledAt?: string | null;
  editableUntil: string;
  professional: { name: string; document: string | null } | null;
}

export interface ProfessionalSearchResult {
  id: string;
  name: string;
  officeName: string | null;
  profession: string | null;
  document: string | null;
}

export interface CreatePhysicalSalePayload {
  customerName: string;
  saleAmount: number;
  sellerName?: string;
  invoiceNumber: string;
  professionalId?: string;
}

export interface CreatePhysicalSaleResponse {
  message: string;
  code: string;
  points: number;
  credited: boolean;
  professionalName?: string;
}

export interface RedeemPhysicalSalePayload {
  code: string;
}

export interface RedeemPhysicalSaleResponse {
  message: string;
  points: number;
}

export interface UpdatePhysicalSalePayload {
  customerName?: string;
  value?: number;
  sellerName?: string;
  invoice?: string;
}

// Compra vista pelo profissional: só o nome da loja, sem dados do cliente
export interface MyPurchase {
  id: string;
  value: number;
  points: number;
  createdAt: string;
  redeemedAt: string | null;
  cancelledAt: string | null;
  partner: { tradeName: string };
}
