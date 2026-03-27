import api from '@/services/api';
import { AxiosResponse } from 'axios';

export interface PointHistoryEntry {
  id: string;
  operation: 'ADD' | 'SUBTRACT';
  value: number;
  source: string;
  professionalId: string;
  createdAt: string;
  updatedAt: string;
}

export async function fetchPointsHistory(limit: number = 50): Promise<AxiosResponse<PointHistoryEntry[]>> {
  return await api.get('points/history', {
    params: { limit },
  });
}
