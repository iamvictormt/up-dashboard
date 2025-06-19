'use client';

import { useState, useEffect } from 'react';
import { Badge } from '@/components/ui/badge';
import { TrendingUp } from 'lucide-react';
import { fetchTrendingTopics } from '@/lib/trending-api';
import { useMuralUpdate } from '@/contexts/mural-update-context';

interface TrendingTopic {
  tag: string;
  count: number;
}

export function TrendingTopics() {
  const [topics, setTopics] = useState<TrendingTopic[]>([]);
  const [loading, setLoading] = useState(true);
  const { updateCount } = useMuralUpdate();

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
  }, [updateCount]);

  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100 p-4">
      <div className="p-3">
        <div className="flex items-center gap-2">
          <TrendingUp className="h-4 w-4 text-[#6c2144]" />
          <h3 className="font-semibold text-sm text-gray-900">Tópicos em alta</h3>
        </div>
      </div>

      {!loading && (
        <div className="space-y-2 p-3">
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
