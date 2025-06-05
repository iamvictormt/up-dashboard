import api from '@/services/api';
import { AxiosResponse } from 'axios';

export async function fetchMyStore(): Promise<AxiosResponse> {
  return await api.get('stores/my-store');
}

export async function updateStore(data: any): Promise<AxiosResponse> {
  return await api.patch(`stores/my-store`, data);
}
