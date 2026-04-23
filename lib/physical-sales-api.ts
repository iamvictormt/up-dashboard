import api from '@/services/api';
import type {
  CreatePhysicalSalePayload,
  CreatePhysicalSaleResponse,
  PhysicalSale,
  RedeemPhysicalSalePayload,
  RedeemPhysicalSaleResponse,
} from '@/types';

export async function createPhysicalSale(payload: CreatePhysicalSalePayload) {
  const response = await api.post<CreatePhysicalSaleResponse>('conexao-premiada/register-sale', {
    customerName: payload.customerName,
    value: payload.saleAmount,
    sellerName: payload.sellerName,
    invoice: payload.invoiceNumber,
  });
  return response.data;
}

export async function redeemPhysicalSaleCode(payload: RedeemPhysicalSalePayload) {
  const response = await api.post<RedeemPhysicalSaleResponse>('conexao-premiada/redeem-code', payload);
  return response.data;
}

export async function fetchPhysicalSales() {
  const response = await api.get<PhysicalSale[]>('conexao-premiada/get-sales');
  return response.data;
}

