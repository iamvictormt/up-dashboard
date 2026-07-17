import api from '@/services/api';
import type { AxiosResponse } from 'axios';
import type { Wellness, WellnessOffering } from '@/types/wellness';

export async function fetchWellnessList(
  searchQuery?: string,
  page = 1,
  limit = 6,
  state?: string,
  city?: string,
  category?: string,
): Promise<AxiosResponse<Wellness[]>> {
  const params: Record<string, string | number> = { page, limit };
  if (searchQuery) params.search = searchQuery;
  if (state) params.state = state;
  if (city) params.city = city;
  if (category) params.category = category;
  return api.get('wellness', { params });
}

export async function fetchWellnessCategories(): Promise<AxiosResponse> {
  return api.get('wellness-categories');
}

export async function fetchWellnessById(id: string): Promise<AxiosResponse<Wellness>> {
  return api.get(`wellness/${id}`);
}

export async function fetchMyWellness(): Promise<AxiosResponse<Wellness>> {
  return api.get('wellness/me');
}

export async function updateWellness(data: Partial<Wellness>): Promise<AxiosResponse<Wellness>> {
  return api.patch('wellness', data);
}

export async function toggleFavoriteWellness(id: string): Promise<AxiosResponse> {
  return api.post(`wellness/${id}/favorite`);
}

export async function createWellnessOffering(
  data: Omit<WellnessOffering, 'id'>,
): Promise<AxiosResponse<WellnessOffering>> {
  return api.post('wellness/services', data);
}

export async function updateWellnessOffering(
  id: string,
  data: Partial<WellnessOffering>,
): Promise<AxiosResponse<WellnessOffering>> {
  return api.patch(`wellness/services/${id}`, data);
}

export async function deleteWellnessOffering(id: string): Promise<AxiosResponse> {
  return api.delete(`wellness/services/${id}`);
}
