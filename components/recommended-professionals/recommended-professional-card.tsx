'use client';

import { useState } from 'react';
import { Clock, Linkedin, Instagram, Phone, MapPin, MessageCircle, User2 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ProfessionalProfileModal } from '@/components/recommended-professionals/recommended-professional-profile-modal';

interface Professional {
  id: string;
  name: string;
  profession: string;
  description: string;
  phone: string;
  email: string;
  profileImage: string;
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

const SocialMediaIconsCard = ({ socialMedia, phone }: { socialMedia: Professional['socialMedia']; phone: string }) => {
  const formattedWhatsApp = formatWhatsAppNumber(socialMedia?.whatsapp || '');
  return (
    <div className="flex items-center space-x-1">
      <Button
        variant="ghost"
        size="sm"
        className={`rounded-full w-8 h-8 p-0 ${
          formattedWhatsApp
            ? 'hover:bg-green-100 hover:text-green-600 text-[#511A2B]/70'
            : 'text-gray-300 cursor-default'
        }`}
        onClick={formattedWhatsApp ? () => window.open(`https://wa.me/${formattedWhatsApp}`, '_blank') : undefined}
        disabled={!formattedWhatsApp}
      >
        <MessageCircle className="w-4 h-4" />
        <span className="sr-only">WhatsApp</span>
      </Button>

      <Button
        variant="ghost"
        size="sm"
        className={`rounded-full w-8 h-8 p-0 ${
          socialMedia?.linkedin
            ? 'hover:bg-blue-100 hover:text-blue-600 text-[#511A2B]/70'
            : 'text-gray-300 cursor-default'
        }`}
        onClick={socialMedia?.linkedin ? () => window.open(socialMedia.linkedin, '_blank') : undefined}
        disabled={!socialMedia?.linkedin}
      >
        <Linkedin className="w-4 h-4" />
        <span className="sr-only">LinkedIn</span>
      </Button>

      <Button
        variant="ghost"
        size="sm"
        className={`rounded-full w-8 h-8 p-0 ${
          socialMedia?.instagram
            ? 'hover:bg-pink-100 hover:text-pink-600 text-[#511A2B]/70'
            : 'text-gray-300 cursor-default'
        }`}
        onClick={socialMedia?.instagram ? () => window.open(socialMedia.instagram, '_blank') : undefined}
        disabled={!socialMedia?.instagram}
      >
        <Instagram className="w-4 h-4" />
        <span className="sr-only">Instagram</span>
      </Button>

      <Button
        variant="ghost"
        size="sm"
        className="rounded-full w-8 h-8 p-0 md:hidden hover:bg-blue-100 hover:text-blue-600 text-[#511A2B]/70"
        onClick={() => window.open(`tel:${phone}`, '_blank')}
      >
        <Phone className="w-4 h-4" />
        <span className="sr-only">Telefone</span>
      </Button>
    </div>
  );
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

export function ProfessionalCard({ professional }: ProfessionalCardProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { name, profession, description, profileImage, isActive, address, availableDays, socialMedia, phone } =
    professional;

  return (
    <>
      <Card className="bg-white/90 backdrop-blur-sm border-[#511A2B]/10 rounded-2xl hover:border-[#511A2B]/30 transition-all duration-300 shadow-sm hover:shadow-md">
        <CardContent className="p-4 md:p-6">
          <div className="flex flex-col md:flex-row items-center md:items-start space-y-3 md:space-y-0 md:space-x-4 mb-4">
            <Avatar className="w-16 h-16 rounded-xl">
              <AvatarFallback>{name.charAt(0).toUpperCase()}</AvatarFallback>
            </Avatar>

            <div className="flex-1 flex flex-col items-center md:items-start text-center md:text-left">
              <h3 className="font-semibold text-[#511A2B] text-lg md:text-xl capitalize">{name.toLowerCase()}</h3>
              <p className="text-[#FEC460] text-sm md:text-base font-medium capitalize">{profession.toLowerCase()}</p>

              <div className="flex items-center space-x-2 mt-1 md:mt-2">
                <Badge
                  className={`${
                    isActive
                      ? 'bg-green-100 text-green-700 border-green-200 hover:bg-green-200'
                      : 'bg-gray-100 text-gray-600 border-gray-200 hover:bg-gray-200'
                  } rounded-lg text-xs md:text-sm`}
                >
                  {isActive ? 'Ativo' : 'Inativo'}
                </Badge>
              </div>
            </div>
          </div>

          <div className="mb-4">
            <p className="text-sm md:text-base text-[#511A2B]/80 line-clamp-2 md:line-clamp-3">
              {description || 'Sem descrição disponível.'}
            </p>
          </div>

          <div className="space-y-2 mb-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <MapPin className="w-4 h-4 text-[#511A2B]/60" />
                <span className="text-sm text-[#511A2B]/70">Localização</span>
              </div>
              <span className="text-sm md:text-base text-[#511A2B] font-medium">
                {address.district}, {address.city}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Clock className="w-4 h-4 text-[#511A2B]/60" />
                <span className="text-sm text-[#511A2B]/70">Disponibilidade</span>
              </div>
              <span className="text-sm md:text-base text-[#511A2B] font-medium">
                {formatAvailableDays(availableDays)}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Phone className="w-4 h-4 text-[#511A2B]/60" />
                <span className="text-sm text-[#511A2B]/70">Contato</span>
              </div>
              <span className="text-sm md:text-base text-[#511A2B] font-medium">
                <SocialMediaIconsCard socialMedia={socialMedia} phone={phone} />
              </span>
            </div>
          </div>

          <div className="flex">
            <Button
              className="flex-1 rounded-xl bg-[#511A2B] hover:bg-[#511A2B]/90 text-white text-sm md:text-base py-2"
              onClick={() => setIsModalOpen(true)}
            >
              <User2 className="w-4 h-4 mr-2" />
              Ver perfil completo
            </Button>
          </div>
        </CardContent>
      </Card>

      <ProfessionalProfileModal
        professional={professional}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
}
