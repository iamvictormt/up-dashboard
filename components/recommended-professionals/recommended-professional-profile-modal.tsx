'use client';

import { Linkedin, Instagram, Phone, MapPin, Calendar, X, Mail, Facebook } from 'lucide-react';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { AiOutlineWhatsApp } from 'react-icons/ai';

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

export function ProfessionalProfileModal({ professional, isOpen, onClose }: ProfessionalProfileModalProps) {
  const { name, profession, description, isActive, phone, email, address, availableDays, socialMedia } = professional;
  const availableDaysList = formatAvailableDaysFull(availableDays);
  const fullAddress = formatFullAddress(address);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-[95vw] max-w-5xl max-h-[95dvh] overflow-y-auto bg-gradient-to-br from-white via-[#511A2B]/[0.02] to-white p-0 rounded-3xl shadow-2xl">
        {/* Header */}
        <DialogTitle className="hidden"></DialogTitle>
        <div className="relative bg-gradient-to-br from-[#511A2B] via-[#6B2438] to-[#511A2B] p-6 md:p-8 overflow-visible">
          {/* Botão de fechar */}
          <Button
            variant="ghost"
            size="default"
            onClick={onClose}
            className="absolute top-4 right-4 z-20 text-white/80 hover:text-white hover:bg-white/10 rounded-full transition-all duration-300"
          >
            <X className="w-5 h-5" />
          </Button>

          <div className="relative z-10 flex flex-col md:flex-row items-center md:items-start gap-6">
            {/* Avatar */}
            <div className="relative group">
              <Avatar className="relative w-28 h-28 md:w-32 md:h-32 rounded-3xl shadow-2xl">
                <AvatarFallback className="bg-gradient-to-br from-[#FEC460] to-[#FDB940] text-[#511A2B] text-4xl font-bold rounded-3xl">
                  {getInitials(name)}
                </AvatarFallback>
              </Avatar>
              {isActive && (
                <div className="absolute -bottom-2 -right-2 bg-green-500 text-white px-3 py-1 rounded-full text-xs font-semibold shadow-lg flex items-center gap-1">
                  <div className="absolute inset-0 bg-green-500 rounded-full animate-ping opacity-75" />
                  Ativo
                </div>
              )}
            </div>

            {/* Informações */}
            <div className="flex-1 text-center md:text-left space-y-3">
              <h2 className="text-3xl md:text-4xl font-bold text-white capitalize leading-tight">
                {name.toLowerCase()}
              </h2>
              <div className="inline-flex items-center gap-2 bg-[#FEC460]/20 backdrop-blur-sm px-4 py-2 rounded-full border border-[#FEC460]/30">
                <p className="text-[#FEC460] text-lg font-semibold capitalize">{profession.toLowerCase()}</p>
              </div>
              {description && <p className="text-white/90 leading-relaxed text-base max-w-2xl">{description}</p>}
            </div>
          </div>
        </div>

        {/* Conteúdo principal */}
        <div className="overflow-y-auto p-6 md:p-8 space-y-6" style={{ maxHeight: '80dvh' }}>
          {/* Contato */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-[#511A2B] flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-[#511A2B] to-[#6B2438] rounded-lg flex items-center justify-center">
                <Phone className="w-4 h-4 text-white" />
              </div>
              Informações de Contato
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="group relative bg-gradient-to-br from-white to-[#511A2B]/[0.02] p-5 rounded-2xl border border-[#511A2B]/10 hover:border-[#511A2B]/30 transition-all duration-300 hover:shadow-lg">
                <p className="text-sm text-[#511A2B]/60 font-medium mb-1">Telefone</p>
                <p className="text-lg font-bold text-[#511A2B]">{phone}</p>
              </div>
              <div className="group relative bg-gradient-to-br from-white to-[#511A2B]/[0.02] p-5 rounded-2xl border border-[#511A2B]/10 hover:border-[#511A2B]/30 transition-all duration-300 hover:shadow-lg">
                <p className="text-sm text-[#511A2B]/60 font-medium mb-1">E-mail</p>
                <p className="text-lg font-bold text-[#511A2B] break-all">{email || 'Não informado'}</p>
              </div>
            </div>
          </div>

          {/* Localização */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-[#511A2B] flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-[#511A2B] to-[#6B2438] rounded-lg flex items-center justify-center">
                <MapPin className="w-4 h-4 text-white" />
              </div>
              Localização
            </h3>
            <div className="group relative bg-gradient-to-br from-white to-[#511A2B]/[0.02] p-6 rounded-2xl border border-[#511A2B]/10 hover:border-[#511A2B]/30 transition-all duration-300 hover:shadow-lg">
              <p className="text-[#511A2B] leading-relaxed">{fullAddress}</p>
            </div>
          </div>

          {/* Disponibilidade */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-[#511A2B] flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-[#511A2B] to-[#6B2438] rounded-lg flex items-center justify-center">
                <Calendar className="w-4 h-4 text-white" />
              </div>
              Disponibilidade
            </h3>
            <div className="bg-gradient-to-br from-white to-[#511A2B]/[0.02] p-6 rounded-2xl border border-[#511A2B]/10">
              <p className="text-sm text-[#511A2B]/60 font-medium mb-3">Dias Disponíveis</p>
              <div className="flex flex-wrap gap-2">
                {availableDaysList.map((day, idx) => (
                  <Badge
                    key={idx}
                    className="bg-gradient-to-r from-[#511A2B] to-[#6B2438] text-white border-0 px-4 py-2 text-sm font-medium hover:shadow-lg hover:scale-105 transition-all duration-300"
                  >
                    {day}
                  </Badge>
                ))}
              </div>
            </div>
          </div>

          {/* Redes Sociais */}
          {(socialMedia?.linkedin || socialMedia?.instagram || socialMedia?.whatsapp) && (
            <div className="space-y-4">
              <h3 className="text-xl font-bold text-[#511A2B] flex items-center gap-2">
                <div className="w-8 h-8 bg-gradient-to-br from-[#511A2B] to-[#6B2438] rounded-lg flex items-center justify-center">
                  <Facebook className="w-4 h-4 text-white" />
                </div>
                Redes Sociais
              </h3>
              <div className="flex flex-wrap gap-3">
                {socialMedia?.linkedin && (
                  <Button
                    onClick={() => window.open(socialMedia.linkedin, '_blank')}
                    className="bg-gradient-to-r from-[#0077B5] to-[#006399] text-white border-0 hover:shadow-xl hover:scale-105 transition-all duration-300 px-6 py-6 rounded-xl"
                  >
                    <Linkedin className="w-5 h-5 mr-2" />
                    LinkedIn
                  </Button>
                )}
                {socialMedia?.instagram && (
                  <Button
                    onClick={() => window.open(`https://www.instagram.com/${socialMedia.instagram}`, '_blank')}
                    className="bg-gradient-to-r from-[#E4405F] via-[#C13584] to-[#833AB4] text-white border-0 hover:shadow-xl hover:scale-105 transition-all duration-300 px-6 py-6 rounded-xl"
                  >
                    <Instagram className="w-5 h-5 mr-2" />
                    Instagram
                  </Button>
                )}
                {socialMedia?.whatsapp && (
                  <Button
                    onClick={() => window.open(`https://wa.me/${socialMedia.whatsapp.replace(/\D/g, '')}`, '_blank')}
                    className="bg-gradient-to-r from-[#25D366] to-[#128C7E] text-white border-0 hover:shadow-xl hover:scale-105 transition-all duration-300 px-6 py-6 rounded-xl"
                  >
                    <AiOutlineWhatsApp className="w-5 h-5 mr-2" />
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
