import api from '@/services/api';
import { AxiosResponse } from 'axios';

export async function fetchProfessions(): Promise<AxiosResponse> {
  return await api.get('professions');
}
