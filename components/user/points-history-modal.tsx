'use client';

import { useState, useEffect } from 'react';
import { X, Coins, TrendingUp, TrendingDown, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { fetchPointsHistory, PointHistoryEntry } from '@/lib/points-api';
import { useUser } from '@/contexts/user-context';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { cn } from '@/lib/utils';

interface PointsHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function PointsHistoryModal({ isOpen, onClose }: PointsHistoryModalProps) {
  const { user } = useUser();
  const [history, setHistory] = useState<PointHistoryEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (isOpen) {
      const loadHistory = async () => {
        try {
          setIsLoading(true);
          const response = await fetchPointsHistory();
          setHistory(response.data);
        } catch (error) {
          console.error('Erro ao carregar histórico de pontos:', error);
        } finally {
          setIsLoading(false);
        }
      };
      loadHistory();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[99999] flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[80vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center">
              <Coins className="w-6 h-6 text-yellow-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-[#511A2B]">Extrato de Pontos</h2>
              <p className="text-sm text-gray-500">Acompanhe seu histórico de recompensas</p>
            </div>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Total Points Banner */}
        <div className="bg-[#511A2B] p-6 text-white">
          <p className="text-sm opacity-80 mb-1">Saldo atual</p>
          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-bold">{user?.professional?.points || 0}</span>
            <span className="text-lg opacity-80">pontos</span>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-12 space-y-4">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#511A2B]"></div>
              <p className="text-gray-500">Carregando histórico...</p>
            </div>
          ) : history.length > 0 ? (
            <div className="space-y-4">
              {history.map((entry) => (
                <div key={entry.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                  <div className="flex items-center gap-4">
                    <div className={cn(
                      "w-10 h-10 rounded-full flex items-center justify-center",
                      entry.operation === 'ADD' ? "bg-green-100" : "bg-red-100"
                    )}>
                      {entry.operation === 'ADD' ? (
                        <TrendingUp className="w-5 h-5 text-green-600" />
                      ) : (
                        <TrendingDown className="w-5 h-5 text-red-600" />
                      )}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">
                        {entry.source === 'LOGIN' ? 'Login diário' :
                         entry.source === 'EVENT' ? 'Participação em evento' :
                         entry.source === 'BENEFIT' ? 'Resgate de benefício' : entry.source}
                      </p>
                      <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
                        <Clock className="w-3 h-3" />
                        {format(new Date(entry.createdAt), "dd 'de' MMMM 'às' HH:mm", { locale: ptBR })}
                      </div>
                    </div>
                  </div>
                  <div className={cn(
                    "text-lg font-bold",
                    entry.operation === 'ADD' ? "text-green-600" : "text-red-600"
                  )}>
                    {entry.operation === 'ADD' ? '+' : '-'}{entry.value}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500">Nenhum registro encontrado no seu histórico.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
