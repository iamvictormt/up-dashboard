import api from '@/services/api';
import { AxiosResponse } from 'axios';

export async function fetchStores(searchQuery?: string, page: number = 1, limit: number = 6): Promise<AxiosResponse> {
  const params: Record<string, string | number> = {
    page,
    limit,
  };

  if (searchQuery) {
    params['search'] = searchQuery;
  }

  return await api.get('stores', { params });
}

export async function fetchStoreById(id: string): Promise<AxiosResponse> {
  return await api.get(`stores/${id}`);
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
