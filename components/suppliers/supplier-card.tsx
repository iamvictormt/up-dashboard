'use client';

import {
  Star,
  MapPin,
  Store,
  Package,
  Calendar,
  Clock,
  ArrowRight,
  Sparkles,
  MoreHorizontal,
  Heart,
  Share2,
  ChevronDown,
  Info,
} from 'lucide-react';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { cn, formatCurrency } from '@/lib/utils';

interface Supplier {
  id: string;
  name: string;
  logoUrl?: string | null;
  description: string;
  website: string;
  rating: number;
  openingHours: string;
  address: {
    state: string;
    city: string;
    district: string;
    street: string;
    complement: string | null;
    number: string;
    zipCode: string;
  };
  products: Array<{
    id?: string;
    name: string;
    description: string;
    price: number;
    link: string;
    featured: boolean;
    promotion: boolean;
    photoUrl?: string | null;
  }>;
  events: Array<{
    id?: string;
    name: string;
    description: string;
    date: string;
    type: string;
    points: number;
    totalSpots: number;
    filledSpots: number;
    address: {
      state: string;
      city: string;
      district: string;
      street: string;
      complement: string | null;
      number: string;
      zipCode: string;
    };
  }>;
}

interface SupplierCardProps {
  supplier: Supplier;
}

export function SupplierCard({ supplier }: SupplierCardProps) {
  const { id, name, description, rating, openingHours, address, products, events, logoUrl } = supplier;

  const nextEvent = events.length > 0 ? events[0] : null;

  // Parse opening hours
  const openingHoursList = openingHours ? openingHours.split('|').map((s) => s.trim()) : [];
  const mainOpeningHour = openingHoursList[0] || 'Horário não disponível';
  const hasMoreHours = openingHoursList.length > 1;

  // Calculate active products count for display
  const displayProducts = products.slice(0, 2);
  const remainingProducts = Math.max(0, products.length - 2);

  const hoursList = openingHours
    .split('|')
    .map((h) => h.trim())
    .filter(Boolean);
  const today = new Date().toLocaleDateString('pt-BR', { weekday: 'long' });
  const todayHours = hoursList.find((h) => h.toLowerCase().includes(today.toLowerCase())) || hoursList[0];

  const now = new Date();
  const currentHour = now.getHours();
  const isOpen = todayHours?.includes(':')
    ? (() => {
        const times = todayHours.split(':')[1]?.split('-') || [];
        if (times.length < 2) return false;
        const start = parseInt(times[0].trim());
        const end = parseInt(times[1].trim());
        return currentHour >= start && currentHour < end;
      })()
    : false;

  return (
    <Card className="group relative flex flex-col h-full overflow-hidden border-border/50 bg-background transition-all duration-300 hover:shadow-xl hover:border-primary/20 rounded-2xl">
      {/* Header Background with Gradient */}

      {/* Top Actions */}
      {/* <div className="absolute top-3 right-3 z-10 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <Button
          size="icon"
          variant="secondary"
          className="h-8 w-8 rounded-full bg-background/80 backdrop-blur-sm hover:bg-background shadow-sm"
        >
          <Heart className="h-4 w-4 text-muted-foreground hover:text-red-500 transition-colors" />
        </Button>
        <Button
          size="icon"
          variant="secondary"
          className="h-8 w-8 rounded-full bg-background/80 backdrop-blur-sm hover:bg-background shadow-sm"
        >
          <Share2 className="h-4 w-4 text-muted-foreground hover:text-primary transition-colors" />
        </Button>
      </div> */}

      <CardHeader className="relative z-10 pt-6 pb-2 px-4 sm:px-5 flex-none">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-3 sm:gap-4">
          {/* Logo */}
          <div className="relative flex-shrink-0">
            <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-2xl border-4 border-background bg-white overflow-hidden flex items-center justify-center group-hover:scale-105 transition-transform duration-300">
              {logoUrl ? (
                <img src={logoUrl || '/placeholder.svg'} alt={name} className="w-full h-full object-cover" />
              ) : (
                <Store className="w-8 h-8 text-muted-foreground/50" />
              )}
            </div>
            {rating > 0 && (
              <div className="absolute -bottom-2 -right-2 bg-background border border-border/50 shadow-sm rounded-full px-2 py-0.5 flex items-center gap-1">
                <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                <span className="text-xs font-bold text-foreground">{rating.toFixed(1)}</span>
              </div>
            )}
          </div>

          {/* Title & Location */}
          <div className="flex-1 w-full min-w-0 pt-1 sm:pt-2 text-center sm:text-left">
            <h3 className="font-bold text-base sm:text-lg leading-tight text-foreground truncate group-hover:text-primary transition-colors duration-300 ">
              {name}
            </h3>
            <div className="flex items-center justify-center sm:justify-start gap-1 mt-1 text-muted-foreground text-xs sm:text-sm">
              <span className="truncate">
                {address.city}, {address.state}
              </span>
            </div>

            <div className="flex items-center justify-center sm:justify-start gap-1 mt-2">
              <div
                className={cn(
                  'flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold capitalize tracking-wider border backdrop-blur-sm',
                  isOpen
                    ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-300'
                    : 'bg-red-500/10 border-red-500/20 text-red-300'
                )}
              >
                {isOpen ? 'Aberto' : 'Fechado'}
                <div
                  className={cn('w-1.5 h-1.5 rounded-full animate-pulse', isOpen ? 'bg-emerald-400' : 'bg-red-400')}
                />
              </div>
            </div>

            {/* Opening Hours with Tooltip */}
            <div className="relative group/hours inline-block gap-1 mt-2">
              <Badge
                variant="secondary"
                className={cn(
                  'flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold capitalize tracking-wider border backdrop-blur-sm bg-primary/5 text-primary border-primary/10 transition-colors',
                  hasMoreHours && 'hover:bg-primary/10 pr-1.5'
                )}
              >
                <span className="truncate max-w-[200px] sm:max-w-none">{mainOpeningHour}</span>
                {hasMoreHours && <ChevronDown className="w-3 h-3 ml-1 opacity-50" />}
              </Badge>

              {hasMoreHours && (
                <div className="absolute top-full left-0 mt-2 md:w-60 w-full p-2 bg-popover text-popover-foreground text-xs rounded-lg border shadow-lg opacity-0 invisible group-hover/hours:opacity-100 group-hover/hours:visible transition-all duration-200 z-50 translate-y-1 group-hover/hours:translate-y-0 w-full">
                  <div className="font-semibold mb-1.5 px-1 text-muted-foreground text-[10px] uppercase tracking-wider">
                    Horários de Funcionamento
                  </div>
                  <div className="space-y-1">
                    {openingHoursList.map((hour, i) => (
                      <div key={i} className="px-2 py-1.5 rounded-md hover:bg-muted/50 flex items-center gap-2">
                        <div className="w-1 h-1 rounded-full bg-primary/50" />
                        {hour}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="flex-1 flex flex-col gap-4 sm:gap-5 px-4 sm:px-5 py-4">
        {/* Description */}
        <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
          {description || 'Conheça nossos produtos e eventos exclusivos.'}
        </p>

        {/* Products Section */}
        <div className="space-y-2.5">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
              <Package className="w-3.5 h-3.5" />
              Produtos
            </h4>
            {remainingProducts > 0 ? (
              <span className="text-[10px] font-medium text-muted-foreground bg-muted px-1.5 py-0.5 rounded-md">
                +{remainingProducts}
              </span>
            ) : (
              <span className="text-[10px] font-medium text-muted-foreground bg-transparent px-1.5 py-0.5 rounded-md">
                &nbsp;
              </span>
            )}
          </div>

          {products.length > 0 ? (
            <div className="grid grid-cols-2 gap-2 sm:gap-3">
              {displayProducts.map((product) => (
                <div
                  key={product.id || product.name}
                  className="group/product relative aspect-[4/3] rounded-lg overflow-hidden border border-border/50 bg-muted/20 hover:border-primary/30 transition-all"
                >
                  {product.photoUrl ? (
                    <img
                      src={product.photoUrl || '/placeholder.svg'}
                      alt={product.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover/product:scale-110"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-muted/50">
                      <Package className="w-6 h-6 text-muted-foreground/30" />
                    </div>
                  )}

                  {/* Price Tag */}
                  <div className="absolute bottom-1.5 left-1.5 right-1.5">
                    <div className="bg-background/90 backdrop-blur-sm rounded-md px-1.5 sm:px-2 py-1 shadow-sm border border-border/50 flex items-center justify-between gap-1">
                      <span className="text-[9px] sm:text-[10px] font-medium truncate max-w-[60%]">{product.name}</span>
                      <span className="text-[9px] sm:text-[10px] font-bold text-primary whitespace-nowrap">
                        {formatCurrency(product.price)}
                      </span>
                    </div>
                  </div>

                  {/* Badges */}
                  <div className="absolute top-1.5 right-1.5 flex flex-col gap-1">
                    {product.featured && (
                      <Badge className="bg-primary text-primary-foreground rounded-full text-[10px] px-2 py-0.5 shadow-lg border-0">
                        Destaque
                      </Badge>
                    )}
                    {product.promotion && (
                      <Badge className="bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-full text-[10px] px-2 py-0.5 shadow-lg border-0">
                        Promoção
                      </Badge>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-2 sm:gap-3">
              <div className="aspect-[4/3] rounded-lg border border-dashed border-border/50 bg-muted/10 flex flex-col items-center justify-center">
                <Package className="w-6 h-6 text-muted-foreground/30 mb-1" />
                <span className="text-[10px] font-medium text-muted-foreground/50">Sem produtos</span>
              </div>
              <div className="aspect-[4/3] rounded-lg border border-dashed border-border/50 bg-muted/10 flex flex-col items-center justify-center">
                <Package className="w-6 h-6 text-muted-foreground/30 mb-1" />
                <span className="text-[10px] font-medium text-muted-foreground/50">Sem produtos</span>
              </div>
            </div>
          )}
        </div>

        {/* Next Event Section - Ticket Style */}
        <div className="space-y-2.5">
          <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5" />
            Próximo Evento
          </h4>
          {nextEvent ? (
            <div className="relative overflow-hidden rounded-xl border border-emerald-500/20 bg-emerald-50/50 dark:bg-emerald-950/10 p-3 group/event hover:bg-emerald-50 dark:hover:bg-emerald-950/20 transition-colors">
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <Badge
                      variant="outline"
                      className="h-5 border-emerald-200 text-emerald-700 bg-emerald-100/50 text-[10px] px-1.5"
                    >
                      {nextEvent.type}
                    </Badge>
                    <span className="text-[10px] font-medium text-emerald-600 flex items-center gap-1 whitespace-nowrap">
                      <Calendar className="w-3 h-3" />
                      {new Date(nextEvent.date).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })}
                    </span>
                  </div>
                  <h4 className="text-sm font-semibold text-foreground truncate">{nextEvent.name}</h4>
                  <div className="flex items-center gap-3 mt-2 text-[11px] text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Sparkles className="w-3 h-3 text-emerald-500" />
                      {nextEvent.points} pts
                    </span>
                    <span className="flex items-center gap-1">
                      <MoreHorizontal className="w-3 h-3" />
                      {nextEvent.totalSpots - nextEvent.filledSpots} vagas
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="rounded-xl border border-dashed border-border/50 bg-muted/10 p-3 flex flex-col items-center justify-center text-center min-h-[88px]">
              <Calendar className="w-6 h-6 text-muted-foreground/30 mb-1" />
              <span className="text-[10px] font-medium text-muted-foreground/50">Sem eventos agendados</span>
            </div>
          )}
        </div>
      </CardContent>

      <CardFooter className="p-4 sm:p-5 pt-0">
        <Link href={`/suppliers-store/${id}`} className="w-full">
          <Button className="w-full rounded-xl font-semibold shadow-md hover:shadow-xl transition-all group/btn bg-gradient-to-r from-primary to-primary/90 hover:from-primary hover:to-primary z-[1]">
            Ver Loja
            <ArrowRight className="w-4 h-4 ml-2 group-hover/btn:translate-x-1 transition-transform" />
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
}
