import api from '@/services/api';
import { PartnerSupplierType } from '@/types/partnerSupplier';
import { AxiosResponse } from 'axios';
import type { WellnessPartnerListItem } from '@/types';

export async function fetchStores(searchQuery?: string, page: number = 1, limit: number = 6, type?: PartnerSupplierType): Promise<AxiosResponse> {
  const params: Record<string, string | number> = {
    page,
    limit,
    type: type || 'SUPPLIER',
  };

  if (searchQuery) {
    params['search'] = searchQuery;
  }

  return await api.get('stores', { params });
}

export async function fetchStoreById(id: string): Promise<AxiosResponse> {
  return await api.get(`stores/${id}`);
}

export async function fetchPartnerSupplierById(id: string): Promise<AxiosResponse> {
  return await api.get(`partner-suppliers/${id}`);
}

export async function fetchMyStore(): Promise<AxiosResponse> {
  return await api.get('stores/my-store');
}

export async function createStore(data: any): Promise<AxiosResponse> {
  return await api.post(`stores`, data);
}

export async function updateStore(id: string, data: any): Promise<AxiosResponse> {
  return await api.patch(`stores/${id}/my-store`, data);
}

export async function fetchWellnessPartners(
  searchQuery?: string,
  page: number = 1,
  limit: number = 6
): Promise<AxiosResponse> {
  const params: Record<string, string | number> = {
    page,
    limit,
    type: 'WELLNESS',
  };

  if (searchQuery) {
    params['search'] = searchQuery;
  }

  return await api.get('partner-suppliers', { params });
}

export async function toggleFavoritePartner(id: string): Promise<AxiosResponse> {
  return await api.post(`partner-suppliers/${id}/favorite`);
}

export async function togglePartnerVerification(id: string): Promise<AxiosResponse> {
  return await api.patch(`admin/partner-suppliers/${id}/toggle-verification`);
}

export async function fetchAdminPartnerSuppliers(): Promise<WellnessPartnerListItem[]> {
  const response = await api.get('partner-suppliers', {
    params: {
      type: 'WELLNESS',
      page: 1,
      limit: 200,
    },
  });

  const payload = response.data;
  if (Array.isArray(payload)) {
    return payload;
  }

  if (Array.isArray(payload?.data)) {
    return payload.data;
  }

  if (Array.isArray(payload?.items)) {
    return payload.items;
  }

  return [];
}

export async function updatePartnerSupplierPointsLimit(id: string, pointsLimit: number): Promise<WellnessPartnerListItem> {
  const response = await api.patch<WellnessPartnerListItem>(`admin/partner-suppliers/${id}/points-limit`, { pointsLimit });
  const payload: any = response.data;
  return payload?.data || payload;
}
