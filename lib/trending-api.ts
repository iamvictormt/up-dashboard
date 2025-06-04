import api from '@/services/api';

interface TrendingTopic {
  tag: string;
  count: number;
}

export async function fetchTrendingTopics(): Promise<TrendingTopic[]> {
  const response = await api.get('hashtags/trending-topics');

  return response.data || [];
}
