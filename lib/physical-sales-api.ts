import api from '@/services/api';
import type {
  CreatePhysicalSalePayload,
  CreatePhysicalSaleResponse,
  MyPurchase,
  PhysicalSale,
  ProfessionalSearchResult,
  RedeemPhysicalSalePayload,
  RedeemPhysicalSaleResponse,
  UpdatePhysicalSalePayload,
} from '@/types';

export async function createPhysicalSale(payload: CreatePhysicalSalePayload) {
  const response = await api.post<CreatePhysicalSaleResponse>('conexao-premiada/register-sale', {
    customerName: payload.customerName,
    value: payload.saleAmount,
    sellerName: payload.sellerName,
    invoice: payload.invoiceNumber,
    professionalId: payload.professionalId,
  });
  return response.data;
}

export async function redeemPhysicalSaleCode(payload: RedeemPhysicalSalePayload) {
  const response = await api.post<RedeemPhysicalSaleResponse>('conexao-premiada/redeem-code', payload);
  return response.data;
}

export async function fetchPhysicalSales() {
  const response = await api.get<PhysicalSale[]>('conexao-premiada/get-all-sales');
  return response.data;
}

export async function searchProfessionals(q: string, page = 1) {
  const response = await api.get<{ items: ProfessionalSearchResult[]; hasMore: boolean }>(
    'conexao-premiada/search-professional',
    { params: { q, page } },
  );
  return response.data;
}

export async function updatePhysicalSale(id: string, payload: UpdatePhysicalSalePayload) {
  const response = await api.patch<{ message: string; points: number; pointsDiff: number }>(
    `conexao-premiada/sales/${id}`,
    payload,
  );
  return response.data;
}

export async function cancelPhysicalSale(id: string) {
  const response = await api.patch<{ message: string; points: number; pointsDiff: number }>(
    `conexao-premiada/sales/${id}/cancel`,
  );
  return response.data;
}

export async function fetchMyPurchases() {
  const response = await api.get<MyPurchase[]>('conexao-premiada/my-purchases');
  return response.data;
}
