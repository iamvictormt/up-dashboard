'use client';
import { Clock, CheckCircle2, XCircle, Calendar, Gift, Sparkles, Coins } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { BenefitRedemptionData } from '@/types';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface RedemptionCardProps {
  redemption: BenefitRedemptionData;
}

const statusConfig = {
  PENDING: {
    label: 'Pendente',
    icon: Clock,
    color: 'bg-yellow-500 border-yellow-500',
  },
  USED: {
    label: 'Utilizado',
    icon: CheckCircle2,
    color: 'bg-emerald-500 border-emerald-500',
  },
  CANCELED: {
    label: 'Cancelado',
    icon: XCircle,
    color: 'bg-red-500 border-red-500',
  },
  EXPIRED: {
    label: 'Expirado',
    icon: XCircle,
    color: 'bg-gray-500 border-gray-500',
  },
};

export function RedemptionCard({ redemption }: RedemptionCardProps) {
  const { benefit, status, redeemedAt, usedAt, pointsSpent } = redemption;
  const config = statusConfig[status];
  const StatusIcon = config.icon;

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "dd 'de' MMM, yyyy", { locale: ptBR });
    } catch {
      return dateString;
    }
  };

  return (
    <Card className="group relative bg-white border-[#511A2B]/10 rounded-2xl hover:border-[#511A2B]/30 transition-all duration-300 shadow-sm hover:shadow-lg overflow-hidden">
      {/* Decorative gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#511A2B]/5 via-transparent to-[#FEC460]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      <CardContent className="relative p-5">
        {/* Header with image and status */}
        <div className="flex gap-4 mb-4">
          {/* Benefit Image */}
          <div className="relative w-24 h-24 rounded-xl overflow-hidden bg-gradient-to-br from-[#511A2B]/10 to-[#FEC460]/10 flex-shrink-0">
            {benefit.imageUrl ? (
              <img
                src={benefit.imageUrl || '/placeholder.svg'}
                alt={benefit.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <Gift className="w-10 h-10 text-[#511A2B]/40" />
              </div>
            )}
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2 mb-2">
              <h3 className="font-bold text-[#511A2B] text-lg leading-tight line-clamp-2">{benefit.name}</h3>
            </div>

            <Badge
              className={`${config.color} text-white border font-medium px-2.5 py-1 rounded-lg text-xs flex items-center gap-1.5 w-fit hover:scale-105 transition-transform duration-200 hover:${config.color}`}
            >
              <StatusIcon className="w-3.5 h-3.5" />
              {config.label}
            </Badge>

            <div className="mt-2 flex items-center gap-1.5 text-xs text-[#511A2B]/60">
              <Coins className="w-3.5 h-3.5 text-[#FEC460]" />
              <span className="font-semibold">{pointsSpent} pontos</span>
            </div>
          </div>
        </div>

        {/* Description */}
        <p className="text-sm text-[#511A2B]/70 mb-4 line-clamp-2 md:h-12">{benefit.description}</p>

        {/* Dates */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-xs text-[#511A2B]/60">
            <Calendar className="w-4 h-4 flex-shrink-0" />
            <span>
              Resgatado em <span className="font-medium text-[#511A2B]">{formatDate(redeemedAt)}</span>
            </span>
          </div>

          {usedAt && (
            <div className="flex items-center gap-2 text-xs text-[#511A2B]/60">
              <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
              <span>
                Usado em <span className="font-medium text-[#511A2B]">{formatDate(usedAt)}</span>
              </span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
