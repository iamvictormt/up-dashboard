'use client';

import { useState, useEffect } from 'react';
import { X, Gift, Calendar, Package, Sparkles, CheckCircle2, Coins, Clock, AlertTriangle, Shield } from 'lucide-react';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import type { BenefitData } from '@/types';

interface BenefitModalProps {
  benefit: BenefitData;
  isOpen: boolean;
  onClose: () => void;
  onRedeem?: (benefitId: string) => void;
  isRedeeming?: boolean;
}

const formatDate = (dateString?: string | null): string => {
  if (!dateString) return 'Sem prazo';
  const date = new Date(dateString);
  return date.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
};

export function BenefitModal({ benefit, isOpen, onClose, onRedeem, isRedeeming = false }: BenefitModalProps) {
  const [isConfirming, setIsConfirming] = useState(false);
  const [progress, setProgress] = useState(0);
  const [intervalId, setIntervalId] = useState<NodeJS.Timeout | null>(null);

  const { name, description, pointsCost, quantity, imageUrl, expiresAt } = benefit;

  const isExpiringSoon = expiresAt && new Date(expiresAt) < new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
  const isLimitedQuantity = quantity !== null && quantity < 10;
  const isOutOfStock = quantity !== null && quantity === 0;

  useEffect(() => {
    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [intervalId]);

  useEffect(() => {
    if (!isOpen) {
      setIsConfirming(false);
      setProgress(0);
      if (intervalId) {
        clearInterval(intervalId);
        setIntervalId(null);
      }
    }
  }, [isOpen, intervalId]);

  const handleStartRedeem = () => {
    setIsConfirming(true);
    setProgress(0);

    const duration = 5000; // 5 seconds
    const steps = 50;
    const stepTime = duration / steps;

    const id = setInterval(() => {
      setProgress((prev) => {
        const next = prev + 100 / steps;
        if (next >= 100) {
          clearInterval(id);
          // Trigger actual redemption
          if (onRedeem) {
            onRedeem(benefit.id);
          }
          setIsConfirming(false);
          setProgress(0);
          return 100;
        }
        return next;
      });
    }, stepTime);

    setIntervalId(id);
  };

  const handleCancel = () => {
    if (intervalId) {
      clearInterval(intervalId);
      setIntervalId(null);
    }
    setIsConfirming(false);
    setProgress(0);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-[95vw] max-w-3xl max-h-[95vh] overflow-y-auto rounded-3xl shadow-2xl bg-white p-0 border-0 animate-in fade-in-0 zoom-in-95 duration-300">
        <DialogTitle className="sr-only">{name}</DialogTitle>

        {/* Close Button - Fixed Position */}
        <Button
          variant="ghost"
          size="lg"
          onClick={onClose}
          disabled={isConfirming || isRedeeming}
          className="absolute top-2 right-2 sm:top-4 sm:right-4 z-20 text-white/80 hover:text-white hover:bg-white/10 rounded-2xl transition-all duration-300 w-8 h-8 sm:w-10 sm:h-10"
        >
          <X className="w-5 h-5 sm:w-6 sm:h-6" />
        </Button>

        <div className="relative h-64 sm:h-80 md:h-96 w-full overflow-hidden bg-gradient-to-br from-[#511A2B] to-[#511A2B]/80">
          {imageUrl ? (
            <>
              <img
                src={imageUrl || '/placeholder.svg'}
                alt={name}
                className="h-full w-full object-cover scale-105 animate-in zoom-in-105 duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
              <div className="absolute inset-0 bg-gradient-to-br from-[#511A2B]/20 via-transparent to-[#FEC460]/20" />
            </>
          ) : (
            <div className="flex items-center justify-center h-full relative">
              <div className="absolute inset-0 bg-gradient-to-br from-[#511A2B] to-[#511A2B]/80" />
              <Gift className="w-32 h-32 text-white/20 relative z-10 animate-pulse" />
            </div>
          )}

          <div className="absolute bottom-6 left-6 right-6 flex items-end justify-between gap-4 flex-wrap">
            <Badge className="bg-[#511A2B] text-white border-0 font-bold px-6 py-3 rounded-full text-lg shadow-2xl hover:bg-[#511A2B]/90 backdrop-blur-sm animate-in slide-in-from-left duration-500">
              <Coins className="w-5 h-5 mr-2" />
              {pointsCost} pontos
            </Badge>

            {isOutOfStock && (
              <Badge className="bg-red-500 text-white border-0 font-bold px-4 py-2 rounded-full text-sm shadow-xl animate-in slide-in-from-right duration-500">
                <AlertTriangle className="w-4 h-4 mr-1.5" />
                Esgotado
              </Badge>
            )}
            {!isOutOfStock && isLimitedQuantity && (
              <Badge className="bg-orange-500 text-white border-0 font-bold px-4 py-2 rounded-full text-sm shadow-xl animate-in slide-in-from-right duration-500 animate-pulse">
                <Clock className="w-4 h-4 mr-1.5" />
                Últimas unidades
              </Badge>
            )}
            {!isOutOfStock && isExpiringSoon && (
              <Badge className="bg-orange-500 text-white border-0 font-bold px-4 py-2 rounded-full text-sm shadow-xl animate-in slide-in-from-right duration-500">
                <Calendar className="w-4 h-4 mr-1.5" />
                Expira em breve
              </Badge>
            )}
          </div>
        </div>

        {/* Content Section */}
        <div className="p-6 sm:p-8 md:p-10">
          <div className="mb-6">
            <h2 className="text-3xl sm:text-4xl font-bold text-[#511A2B] mb-3 capitalize leading-tight">
              {name.toLowerCase()}
            </h2>
          </div>

          {/* Description */}
          <p className="text-[#511A2B]/80 text-base sm:text-lg leading-relaxed mb-8">
            {description || 'Sem descrição disponível.'}
          </p>

          {!isConfirming && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
              {/* Quantity */}
              <div className="flex items-start gap-4 p-5 rounded-2xl bg-gradient-to-br from-[#511A2B]/5 to-[#511A2B]/10 border border-[#511A2B]/10 hover:border-[#511A2B]/20 transition-all duration-300 group">
                <div className="w-14 h-14 rounded-xl bg-white shadow-md flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                  <Package className="w-6 h-6 text-[#511A2B]" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-[#511A2B]/60 font-semibold mb-1 uppercase tracking-wide">
                    Disponibilidade
                  </p>
                  {quantity !== null ? (
                    <p
                      className={`text-lg font-bold truncate ${
                        isOutOfStock ? 'text-red-600' : isLimitedQuantity ? 'text-orange-600' : 'text-[#511A2B]'
                      }`}
                    >
                      {isOutOfStock ? 'Esgotado' : `${quantity} ${quantity === 1 ? 'unidade' : 'unidades'}`}
                    </p>
                  ) : (
                    <div className="flex items-center gap-2">
                      <p className="text-lg text-[#511A2B] font-bold">Ilimitada</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Expiration */}
              <div
                className={`flex items-start gap-4 p-5 rounded-2xl border transition-all duration-300 group ${
                  isExpiringSoon
                    ? 'bg-gradient-to-br from-orange-50 to-orange-100/50 border-orange-200 hover:border-orange-300'
                    : 'bg-gradient-to-br from-[#FEC460]/5 to-[#FEC460]/10 border-[#FEC460]/20 hover:border-[#FEC460]/30'
                }`}
              >
                <div className="w-14 h-14 rounded-xl bg-white shadow-md flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                  <Calendar className={`w-6 h-6 ${isExpiringSoon ? 'text-orange-600' : 'text-[#FEC460]'}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-[#511A2B]/60 font-semibold mb-1 uppercase tracking-wide">Validade</p>
                  <p className={`text-lg font-bold truncate ${isExpiringSoon ? 'text-orange-600' : 'text-[#511A2B]'}`}>
                    {formatDate(expiresAt)}
                  </p>
                </div>
              </div>
            </div>
          )}

          {(isExpiringSoon || isLimitedQuantity) && !isOutOfStock && (
            <div className="flex items-center text-center gap-4 p-5 rounded-2xl bg-gradient-to-r from-orange-50 to-amber-50 border-2 border-orange-200 mb-8 animate-in slide-in-from-bottom duration-500">
              <div className="flex-1">
                <p className="text-sm font-semibold text-orange-900 mb-1">Atenção!</p>
                <p className="text-sm text-orange-800 leading-relaxed">
                  {isLimitedQuantity && 'Restam poucas unidades disponíveis. '}
                  {isExpiringSoon && 'Este benefício expira em breve. '}
                  Resgate agora para não perder!
                </p>
              </div>
            </div>
          )}

          {/* Redemption Section */}
          {!isConfirming ? (
            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                onClick={handleStartRedeem}
                className="w-full rounded-xl bg-gradient-to-r from-[#511A2B] to-[#511A2B]/90 hover:from-[#511A2B]/90 hover:to-[#511A2B]/80 text-white font-semibold py-6 shadow-lg hover:shadow-xl transition-all duration-300 group/btn transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed group"
                disabled={isRedeeming || isOutOfStock}
              >
                <Gift className="w-6 h-6 mr-2 group-hover:rotate-12 transition-transform duration-300" />
                <span className="text-base">
                  {isRedeeming ? 'Resgatando...' : isOutOfStock ? 'Indisponível' : 'Resgatar agora'}
                </span>
              </Button>
            </div>
          ) : (
            <div className="space-y-5 animate-in slide-in-from-bottom duration-500">
              <div className="p-8 rounded-3xl bg-gradient-to-br from-[#511A2B]/5 via-[#FEC460]/5 to-[#511A2B]/5 border-2 border-[#511A2B]/20 shadow-inner">
                <p className="text-center text-lg font-bold text-[#511A2B] mb-2">Confirmando resgate</p>
                <p className="text-center text-sm text-[#511A2B]/60 mb-6">
                  O resgate será concluído em{' '}
                  <span className="font-bold text-[#511A2B]">{Math.ceil((100 - progress) / 20)}s</span>
                </p>

                <div className="relative h-4 bg-white/80 rounded-full overflow-hidden shadow-inner">
                  <div
                    className="absolute inset-y-0 left-0 bg-card rounded-full transition-all duration-100 ease-linear shadow-lg"
                    style={{ width: `${progress}%` }}
                  >
                    <div className="absolute inset-0 bg-white/20 animate-pulse" />
                  </div>
                </div>

                <div className="flex items-center justify-center gap-2 mt-4 text-xs text-[#511A2B]/60">
                  <p>Você pode cancelar a qualquer momento</p>
                </div>
              </div>

              <Button
                onClick={handleCancel}
                variant="destructive"
                className="w-full rounded-xl text-white font-semibold py-6 shadow-lg hover:shadow-xl transition-all duration-300 group/btn"
              >
                <X className="w-6 h-6 mr-2" />
                Cancelar resgate
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
