import api from '@/services/api';
import { Profession } from '@/types';

export async function fetchProfessions(): Promise<Profession[]> {
  const cached = sessionStorage.getItem('professions');

  if (cached) {
    return JSON.parse(cached);
  }

  const response = await api.get('professions');

  sessionStorage.setItem('professions', JSON.stringify(response.data));

  return response.data;
}
