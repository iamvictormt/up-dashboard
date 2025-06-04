// Mock data for trending topics
// In a real application, this would fetch from an API endpoint

interface TrendingTopic {
  tag: string;
  count: number;
}

// Simulated API call to fetch trending topics
export async function fetchTrendingTopics(): Promise<TrendingTopic[]> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 800));

  // Return mock data
  return [
    { tag: 'tecnologia', count: 128 },
    { tag: 'inovação', count: 95 },
    { tag: 'sustentabilidade', count: 87 },
    { tag: 'empreendedorismo', count: 76 },
    { tag: 'design', count: 64 },
  ];
}
