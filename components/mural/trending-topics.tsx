'use client';

import { useState, useEffect } from 'react';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { TrendingUp } from 'lucide-react';
import { fetchTrendingTopics } from '@/lib/trending-api';

interface TrendingTopic {
  tag: string;
  count: number;
}

export function TrendingTopics() {
  const [topics, setTopics] = useState<TrendingTopic[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadTopics() {
      try {
        setLoading(true);
        const data = await fetchTrendingTopics();
        setTopics(data);
      } catch (error) {
        console.error('Error loading trending topics:', error);
        setTopics([]);
      } finally {
        setLoading(false);
      }
    }

    loadTopics();
  }, []);

  return (
    <div className="bg-white rounded-xl shadow-sm p-4">
      <div className="flex items-center gap-2 mb-4">
        <TrendingUp className="h-5 w-5 text-gray-700" />
        <h3 className="font-semibold">Tópicos em alta</h3>
      </div>

      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="flex items-center justify-between">
              <Skeleton className="h-5 w-24" />
              <Skeleton className="h-5 w-8" />
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-2">
          {topics.length > 0 ? (
            topics.map((topic, index) => (
              <div key={index} className="flex items-center justify-between">
                <Badge variant="secondary" className="bg-gray-100 hover:bg-gray-200 text-gray-700">
                  #{topic.tag}
                </Badge>
                <span className="text-sm text-gray-500">{topic.count} posts</span>
              </div>
            ))
          ) : (
            <p className="text-sm text-gray-500 text-center py-2">Nenhum tópico em alta no momento</p>
          )}
        </div>
      )}
    </div>
  );
}
