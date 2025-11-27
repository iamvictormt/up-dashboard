import api from '@/services/api';
import { AxiosResponse } from 'axios';

export async function fetchServiceProviders(
  search?: string,
  page: number = 1,
  limit: number = 6
): Promise<AxiosResponse> {
  const params: Record<string, string | number> = { page, limit };

  if (search) {
    params['search'] = search;
  }

  return await api.get('recommended-professionals', { params });
}
