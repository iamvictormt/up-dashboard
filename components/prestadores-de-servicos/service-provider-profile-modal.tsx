'use client';

import { Linkedin, Instagram, Phone, MapPin, Calendar, X, Facebook } from 'lucide-react';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { AiOutlineWhatsApp } from 'react-icons/ai';
import { applyPhoneMask } from '@/utils/masks';

interface Professional {
  id: string;
  name: string;
  profession: string;
  description: string;
  phone: string;
  email: string;
  address: {
    state: string;
    city: string;
    district: string;
    street: string;
    complement?: string;
    number: string;
    zipCode: string;
  };
  socialMedia: {
    linkedin?: string;
    instagram?: string;
    whatsapp: string;
  };
  availableDays: { dayOfWeek: string }[];
  isActive: boolean;
}

interface ProfessionalProfileModalProps {
  professional: Professional;
  isOpen: boolean;
  onClose: () => void;
}

const formatAvailableDaysFull = (days: { dayOfWeek: string }[]) => {
  if (!days || days.length === 0) return ['Não informada'];
  const dayMap: Record<string, string> = {
    MONDAY: 'Segunda-feira',
    TUESDAY: 'Terça-feira',
    WEDNESDAY: 'Quarta-feira',
    THURSDAY: 'Quinta-feira',
    FRIDAY: 'Sexta-feira',
    SATURDAY: 'Sábado',
    SUNDAY: 'Domingo',
  };
  return days.map((day) => dayMap[day.dayOfWeek] || day.dayOfWeek);
};

const formatFullAddress = (address: Professional['address']) => {
  if (!address) return '';
  const { street, number, complement, district, city, state, zipCode } = address;
  return [street && number ? `${street}, ${number}` : street || number, complement, district, city, state, zipCode]
    .filter(Boolean)
    .join(', ');
};

const getInitials = (name: string) => {
  const names = name.trim().split(' ');
  if (names.length === 1) return names[0].charAt(0).toUpperCase();
  return (names[0].charAt(0) + names[names.length - 1].charAt(0)).toUpperCase();
};

export function ServiceProviderProfileModal({ professional, isOpen, onClose }: ProfessionalProfileModalProps) {
  const { name, profession, description, isActive, phone, email, address, availableDays, socialMedia } = professional;
  const availableDaysList = formatAvailableDaysFull(availableDays);
  const fullAddress = formatFullAddress(address);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-[95vw] max-w-5xl h-[95dvh] max-h-[900px] rounded-2xl sm:rounded-3xl shadow-2xl bg-gradient-to-br from-white via-[#511A2B]/[0.02] to-white p-0 overflow-hidden flex flex-col">
        {/* Header */}
        <DialogTitle className="hidden"></DialogTitle>
        <div className="relative bg-gradient-to-br from-[#511A2B] via-[#6B2438] to-[#511A2B] p-4 sm:p-6 md:p-8 overflow-visible flex-shrink-0">
          <Button
            variant="ghost"
            size="lg"
            onClick={onClose}
            className="absolute top-2 right-2 sm:top-4 sm:right-4 z-20 text-white/80 hover:text-white hover:bg-white/10 rounded-2xl transition-all duration-300 w-8 h-8 sm:w-10 sm:h-10"
          >
            <X className="w-4 h-4 sm:w-5 sm:h-5" />
          </Button>

          <div className="relative z-10 flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-6">
            <div className="relative group flex-shrink-0">
              <Avatar className="relative w-20 h-20 sm:w-24 sm:h-24 md:w-32 md:h-32 rounded-2xl sm:rounded-3xl shadow-2xl">
                <AvatarFallback className="bg-gradient-to-br from-[#FEC460] to-[#FDB940] text-[#511A2B] text-2xl sm:text-3xl md:text-4xl font-bold rounded-2xl sm:rounded-3xl">
                  {getInitials(name)}
                </AvatarFallback>
              </Avatar>
              {isActive && (
                <div className="absolute -bottom-1 -right-1 sm:-bottom-2 sm:-right-2 bg-green-500 text-white px-2 py-0.5 sm:px-3 sm:py-1 rounded-full text-[10px] sm:text-xs font-semibold shadow-lg flex items-center gap-1">
                  <div className="absolute inset-0 bg-green-500 rounded-full animate-ping opacity-75" />
                  <span className="relative">Ativo</span>
                </div>
              )}
            </div>

            <div className="flex-1 text-center sm:text-left space-y-2 sm:space-y-3 min-w-0">
              <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-white capitalize leading-tight break-words">
                {name.toLowerCase()}
              </h2>
              <div className="inline-flex items-center gap-2 bg-[#FEC460]/20 backdrop-blur-sm px-3 py-1.5 sm:px-4 sm:py-2 rounded-full border border-[#FEC460]/30">
                <p className="text-[#FEC460] text-sm sm:text-base md:text-lg font-semibold capitalize">
                  {profession.toLowerCase()}
                </p>
              </div>
              <p className="text-white/90 leading-relaxed text-xs sm:text-sm md:text-base max-w-2xl break-words">
                {description || 'Sem descrição disponível.'}
              </p>
            </div>
          </div>
        </div>

        {/* Conteúdo scrollável */}
        <div className="overflow-y-auto p-4 sm:p-6 md:p-8 space-y-4 sm:space-y-6 flex-1">
          {/* Contato */}
          <div className="space-y-3 sm:space-y-4">
            <h3 className="text-base sm:text-lg md:text-xl font-bold text-[#511A2B] flex items-center gap-2">
              <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-br from-[#511A2B] to-[#6B2438] rounded-lg flex items-center justify-center flex-shrink-0">
                <Phone className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
              </div>
              <span className="break-words">Informações de Contato</span>
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <div className="group relative bg-gradient-to-br from-white to-[#511A2B]/[0.02] p-4 sm:p-5 rounded-xl sm:rounded-2xl border border-[#511A2B]/10 hover:border-[#511A2B]/30 transition-all duration-300 hover:shadow-lg">
                <p className="text-xs sm:text-sm text-[#511A2B]/60 font-medium mb-1">Telefone</p>
                <p className="text-base sm:text-lg font-bold text-[#511A2B] break-words">{applyPhoneMask(phone)}</p>
              </div>
              <div className="group relative bg-gradient-to-br from-white to-[#511A2B]/[0.02] p-4 sm:p-5 rounded-xl sm:rounded-2xl border border-[#511A2B]/10 hover:border-[#511A2B]/30 transition-all duration-300 hover:shadow-lg">
                <p className="text-xs sm:text-sm text-[#511A2B]/60 font-medium mb-1">E-mail</p>
                <p className="text-base sm:text-lg font-bold text-[#511A2B] break-all">{email || 'Não informado'}</p>
              </div>
            </div>
          </div>

          {/* Localização */}
          <div className="space-y-3 sm:space-y-4">
            <h3 className="text-base sm:text-lg md:text-xl font-bold text-[#511A2B] flex items-center gap-2">
              <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-br from-[#511A2B] to-[#6B2438] rounded-lg flex items-center justify-center flex-shrink-0">
                <MapPin className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
              </div>
              <span className="break-words">Localização</span>
            </h3>
            <div className="group relative bg-gradient-to-br from-white to-[#511A2B]/[0.02] p-4 sm:p-6 rounded-xl sm:rounded-2xl border border-[#511A2B]/10 hover:border-[#511A2B]/30 transition-all duration-300 hover:shadow-lg">
              <p className="text-[#511A2B] leading-relaxed text-sm sm:text-base break-words">{fullAddress}</p>
            </div>
          </div>

          {/* Disponibilidade */}
          <div className="space-y-3 sm:space-y-4">
            <h3 className="text-base sm:text-lg md:text-xl font-bold text-[#511A2B] flex items-center gap-2">
              <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-br from-[#511A2B] to-[#6B2438] rounded-lg flex items-center justify-center flex-shrink-0">
                <Calendar className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
              </div>
              <span className="break-words">Disponibilidade</span>
            </h3>
            <div className="bg-gradient-to-br from-white to-[#511A2B]/[0.02] p-4 sm:p-6 rounded-xl sm:rounded-2xl border border-[#511A2B]/10">
 
              <div className="flex flex-wrap gap-1.5 sm:gap-2">
                {availableDaysList.map((day, idx) => (
                  <Badge
                    key={idx}
                    className="bg-gradient-to-r from-[#511A2B] to-[#6B2438] text-white border-0 px-2.5 py-1 sm:px-4 sm:py-2 text-xs sm:text-sm font-medium hover:shadow-lg hover:scale-105 transition-all duration-300"
                  >
                    {day}
                  </Badge>
                ))}
              </div>
            </div>
          </div>

          {/* Redes Sociais */}
          {(socialMedia?.linkedin || socialMedia?.instagram || socialMedia?.whatsapp) && (
            <div className="space-y-3 sm:space-y-4">
              <h3 className="text-base sm:text-lg md:text-xl font-bold text-[#511A2B] flex items-center gap-2">
                <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-br from-[#511A2B] to-[#6B2438] rounded-lg flex items-center justify-center flex-shrink-0">
                  <Facebook className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
                </div>
                <span className="break-words">Redes Sociais</span>
              </h3>
              <div className="flex flex-wrap gap-2 sm:gap-3">
                {socialMedia?.linkedin && (
                  <Button
                    onClick={() => window.open(socialMedia.linkedin, '_blank')}
                    className="bg-gradient-to-r from-[#0077B5] to-[#006399] text-white border-0 hover:shadow-xl hover:scale-105 transition-all duration-300 px-4 py-5 sm:px-6 sm:py-6 rounded-lg sm:rounded-xl text-sm sm:text-base"
                  >
                    <Linkedin className="w-4 h-4 sm:w-5 sm:h-5 mr-1.5 sm:mr-2" />
                    LinkedIn
                  </Button>
                )}
                {socialMedia?.instagram && (
                  <Button
                    onClick={() => window.open(`https://www.instagram.com/${socialMedia.instagram}`, '_blank')}
                    className="bg-gradient-to-r from-[#E4405F] via-[#C13584] to-[#833AB4] text-white border-0 hover:shadow-xl hover:scale-105 transition-all duration-300 px-4 py-5 sm:px-6 sm:py-6 rounded-lg sm:rounded-xl text-sm sm:text-base"
                  >
                    <Instagram className="w-4 h-4 sm:w-5 sm:h-5 mr-1.5 sm:mr-2" />
                    Instagram
                  </Button>
                )}
                {socialMedia?.whatsapp && (
                  <Button
                    onClick={() => window.open(`https://wa.me/${socialMedia.whatsapp.replace(/\D/g, '')}`, '_blank')}
                    className="bg-gradient-to-r from-[#25D366] to-[#128C7E] text-white border-0 hover:shadow-xl hover:scale-105 transition-all duration-300 px-4 py-5 sm:px-6 sm:py-6 rounded-lg sm:rounded-xl text-sm sm:text-base"
                  >
                    <AiOutlineWhatsApp className="w-4 h-4 sm:w-5 sm:h-5 mr-1.5 sm:mr-2" />
                    WhatsApp
                  </Button>
                )}
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
