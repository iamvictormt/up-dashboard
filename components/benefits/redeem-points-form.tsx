'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { redeemPhysicalPoints } from '@/lib/physical-sales-api';
import { toast } from 'sonner';
import { Ticket, Sparkles } from 'lucide-react';
import { useUser } from '@/contexts/user-context';

export function RedeemPointsForm() {
  const [code, setCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { user, updateUser } = useUser();

  const handleRedeem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim()) return;

    try {
      setIsLoading(true);
      const response = await redeemPhysicalPoints(code);
      const pointsWon = response.data.pointsAwarded;

      if (user?.professional) {
        updateUser({
          professional: {
            ...user.professional,
            points: (user.professional.points || 0) + pointsWon,
          },
        });
      }

      toast.success(`Sucesso! Você ganhou ${pointsWon} pontos.`);
      setCode('');
    } catch (error: any) {
      const message = error.response?.data?.message || 'Erro ao resgatar pontos. Verifique o código.';
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="bg-white/80 border-[#511A2B]/10 shadow-lg mb-8 overflow-hidden">
      <div className="bg-[#511A2B] p-4 flex items-center gap-3">
        <Ticket className="w-6 h-6 text-white" />
        <h3 className="text-white font-bold text-lg">Resgate Conexão Premiada</h3>
      </div>
      <CardContent className="p-6">
        <CardDescription className="mb-4">
          Digite o código recebido na loja física para resgatar seus pontos de fidelidade.
        </CardDescription>
        <form onSubmit={handleRedeem} className="flex flex-col sm:flex-row gap-3">
          <Input
            placeholder="Digite o código (ex: ABC-123)"
            value={code}
            onChange={(e) => setCode(e.target.value.toUpperCase())}
            className="flex-1 h-12 uppercase font-mono font-bold tracking-widest text-center"
            maxLength={10}
          />
          <Button type="submit" className="h-12 px-8 rounded-xl font-bold" disabled={isLoading || !code.trim()}>
            {isLoading ? 'Validando...' : 'Resgatar Pontos'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
