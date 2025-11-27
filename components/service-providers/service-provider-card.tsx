'use client';

import { useState } from 'react';
import { Linkedin, Instagram, Phone, MapPin, MessageCircle, User2, Calendar } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { ServiceProviderProfileModal } from '../service-providers/service-provider-profile-modal';
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
  availableDays: {
    dayOfWeek: string;
  }[];
  isActive: boolean;
}

interface ProfessionalCardProps {
  professional: Professional;
}

const formatWhatsAppNumber = (phoneNumber: string): string => {
  if (!phoneNumber) return '';
  const cleanNumber = phoneNumber.replace(/\D/g, '');
  return cleanNumber.startsWith('55') ? cleanNumber : `55${cleanNumber}`;
};

const formatAvailableDays = (days: { dayOfWeek: string }[]) => {
  if (!days || days.length === 0) return 'Não informada';
  const dayMap: Record<string, string> = {
    MONDAY: 'Seg',
    TUESDAY: 'Ter',
    WEDNESDAY: 'Qua',
    THURSDAY: 'Qui',
    FRIDAY: 'Sex',
    SATURDAY: 'Sáb',
    SUNDAY: 'Dom',
  };
  return days.map((day) => dayMap[day.dayOfWeek] || day.dayOfWeek).join(', ');
};

const getInitials = (name: string): string => {
  const words = name.trim().split(' ');
  if (words.length === 1) {
    return words[0].substring(0, 2).toUpperCase();
  }
  return (words[0].charAt(0) + words[words.length - 1].charAt(0)).toUpperCase();
};

export function ProfessionalCard({ professional }: ProfessionalCardProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { name, profession, description, isActive, address, availableDays, socialMedia, phone } = professional;

  const formattedWhatsApp = formatWhatsAppNumber(socialMedia?.whatsapp || '');

  return (
    <>
      <Card className="group relative bg-white border-[#511A2B]/10 rounded-3xl hover:border-[#511A2B]/30 transition-all duration-500 shadow-sm hover:shadow-xl overflow-hidden">
        {/* Decorative gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#511A2B]/5 via-transparent to-[#FEC460]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

        <CardContent className="relative p-6">
          {/* Header with Avatar and Info */}
          <div className="flex items-start gap-4 mb-5">
            {/* Avatar with decorative ring */}
            <div className="relative">
              <div
                className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${
                  isActive ? 'from-[#511A2B] to-[#FEC460]' : 'from-gray-300 to-gray-400'
                } opacity-20 blur-md`}
              />
              <Avatar className="relative w-20 h-20 rounded-2xl border-2 border-white shadow-lg">
                <AvatarFallback className="bg-gradient-to-br from-[#511A2B] to-[#511A2B]/80 text-white text-xl font-bold rounded-2xl">
                  {getInitials(name)}
                </AvatarFallback>
              </Avatar>
              {/* Active indicator dot */}
              {isActive && (
                <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-4 border-white shadow-lg">
                  <div className="absolute inset-0 bg-green-500 rounded-full animate-ping opacity-75" />
                </div>
              )}
            </div>

            {/* Name and Profession */}
            <div className="flex-1 min-w-0">
              <h3 className="font-bold text-[#511A2B] text-xl mb-1 capitalize truncate">{name.toLowerCase()}</h3>
              <div className="flex items-center gap-2 mb-2">
                <Badge className="bg-gradient-to-r from-[#FEC460] to-[#FEC460]/80 text-[#511A2B] border-0 font-semibold px-3 py-1 rounded-full text-xs capitalize shadow-sm">
                  {profession.toLowerCase()}
                </Badge>
              </div>

              {/* Social Media Icons */}
              <div className="flex items-center gap-1">
                {formattedWhatsApp && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-9 h-9 p-0 rounded-xl hover:bg-green-50 hover:text-green-600 text-[#511A2B]/60 transition-all duration-300"
                    onClick={() => window.open(`https://wa.me/${formattedWhatsApp}`, '_blank')}
                  >
                    <AiOutlineWhatsApp className="w-4 h-4" />
                  </Button>
                )}
                {socialMedia?.linkedin && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-9 h-9 p-0 rounded-xl hover:bg-blue-50 hover:text-blue-600 text-[#511A2B]/60 transition-all duration-300"
                    onClick={() => window.open(socialMedia.linkedin, '_blank')}
                  >
                    <Linkedin className="w-4 h-4" />
                  </Button>
                )}
                {socialMedia?.instagram && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-9 h-9 p-0 rounded-xl hover:bg-pink-50 hover:text-pink-600 text-[#511A2B]/60 transition-all duration-300"
                    onClick={() => window.open(`https://www.instagram.com/${socialMedia.instagram}`, '_blank')}
                  >
                    <Instagram className="w-4 h-4" />
                  </Button>
                )}
                {phone && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-9 h-9 p-0 rounded-xl hover:bg-[#511A2B]/10 hover:text-[#511A2B] text-[#511A2B]/60 transition-all duration-300"
                    onClick={() => window.open(`tel:${phone}`, '_blank')}
                  >
                    <Phone className="w-4 h-4" />
                  </Button>
                )}
              </div>
            </div>
          </div>

          {/* Description */}
          {
            <div className="mb-5">
              <p className="text-sm text-[#511A2B]/70 line-clamp-1 leading-relaxed">
                {description || 'Sem descrição disponível.'}
              </p>
            </div>
          }

          {/* Info Cards */}
          <div className="space-y-2 mb-5">
            {/* Location */}
            <div className="flex items-center gap-3 p-3 rounded-xl bg-gradient-to-r from-[#511A2B]/5 to-transparent group-hover:from-[#511A2B]/10 transition-colors duration-300">
              <div className="w-10 h-10 rounded-lg bg-white shadow-sm flex items-center justify-center flex-shrink-0">
                <MapPin className="w-5 h-5 text-[#511A2B]" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-[#511A2B]/60 font-medium mb-0.5">Localização</p>
                <p className="text-sm text-[#511A2B] font-semibold truncate capitalize">
                  {address.district.toLowerCase()}, {address.city.toLowerCase()}
                </p>
              </div>
            </div>

            {/* Availability */}
            <div className="flex items-center gap-3 p-3 rounded-xl bg-gradient-to-r from-[#FEC460]/10 to-transparent group-hover:from-[#FEC460]/20 transition-colors duration-300">
              <div className="w-10 h-10 rounded-lg bg-white shadow-sm flex items-center justify-center flex-shrink-0">
                <Calendar className="w-5 h-5 text-[#FEC460]" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-[#511A2B]/60 font-medium mb-0.5">Disponibilidade</p>
                <p className="text-sm text-[#511A2B] font-semibold truncate">{formatAvailableDays(availableDays)}</p>
              </div>
            </div>
          </div>

          {/* Action Button */}
          <Button
            className="w-full rounded-xl bg-gradient-to-r from-[#511A2B] to-[#511A2B]/90 hover:from-[#511A2B]/90 hover:to-[#511A2B]/80 text-white font-semibold py-6 shadow-lg hover:shadow-xl transition-all duration-300 group/btn"
            onClick={() => setIsModalOpen(true)}
          >
            <User2 className="w-5 h-5 mr-2 group-hover/btn:scale-110 transition-transform duration-300" />
            Ver perfil completo
          </Button>
        </CardContent>
      </Card>

      {/* Modal placeholder - you'll need to import and use your actual modal component */}
      <ServiceProviderProfileModal
        professional={professional}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
}
