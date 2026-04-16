import api from '@/services/api';
import type {
  AdminDashboardStatistics,
  CreatePhysicalSalePayload,
  CreatePhysicalSaleResponse,
  PhysicalSale,
  RedeemPhysicalSalePayload,
  RedeemPhysicalSaleResponse,
} from '@/types';

export async function fetchAdminDashboardStatistics() {
  const response = await api.get<AdminDashboardStatistics>('admin/dashboard/statistics');
  const payload: any = response.data;
  return payload?.data || payload;
}

export async function fetchAdminPhysicalSales() {
  const response = await api.get<PhysicalSale[]>('admin/physical-sales');
  const payload: any = response.data;
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload?.data)) return payload.data;
  if (Array.isArray(payload?.items)) return payload.items;
  return [];
}

export async function createPhysicalSale(payload: CreatePhysicalSalePayload) {
  const response = await api.post<CreatePhysicalSaleResponse>('physical-sales', payload);
  return response.data;
}

export async function redeemPhysicalSaleCode(payload: RedeemPhysicalSalePayload) {
  const response = await api.post<RedeemPhysicalSaleResponse>('physical-sales/redeem', payload);
  return response.data;
}
