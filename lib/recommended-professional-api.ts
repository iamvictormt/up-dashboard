import api from '@/services/api';
import { AxiosResponse } from 'axios';

export async function fetchRecommendedProfessionals(): Promise<AxiosResponse> {
  return await api.get('recommended-professionals');
}
