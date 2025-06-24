import api from '@/services/api';
import { AxiosResponse } from 'axios';

export async function fetchWorkshops(): Promise<AxiosResponse> {
  return await api.get('workshops') || [];
}
