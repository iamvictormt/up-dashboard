import api from '@/services/api';
import { AxiosResponse } from 'axios';

export async function fetchAdminStatistics(): Promise<AxiosResponse> {
  return await api.get('admin/dashboard/statistics');
}

export async function fetchPhysicalSales(): Promise<AxiosResponse> {
  return await api.get('admin/physical-sales');
}

export async function updatePartnerPointsLimit(id: string, pointsLimit: number): Promise<AxiosResponse> {
  return await api.patch(`admin/partner-suppliers/${id}/points-limit`, { pointsLimit });
}

export async function fetchAllPartnersForAdmin(params?: any): Promise<AxiosResponse> {
  return await api.get('partner-suppliers', { params });
}
