import api from '@/services/api';
import type { Community } from '@/types/community';

export async function fetchCommunities(): Promise<Community[]> {
  const response = await api.get('communities');
  return response.data || [];
}
