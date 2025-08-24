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

const formatAvailableDays = (days: { dayOfWeek: string }[]) => {
  if (!days || days.length === 0) return 'Não disponível';

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
      <Card className="bg-white/80 backdrop-blur-sm border-[#511A2B]/10 rounded-2xl hover:border-[#511A2B]/30 transition-all duration-300 shadow-sm hover:shadow-md">
        <CardContent className="p-6">
          <div className="flex items-start space-x-4 mb-4">
            <Avatar className="w-16 h-16 rounded-xl">
              <AvatarImage src={profileImage || '/placeholder.svg'} />
              <AvatarFallback className="rounded-xl bg-[#511A2B] text-white text-lg">
                {name
                  .split(' ')
                  .map((n) => n[0])
                  .join('')}
              </AvatarFallback>
            </Avatar>

            <div className="flex-1">
              <h3 className="font-semibold text-[#511A2B] text-lg">{name}</h3>
              <p className="text-[#FEC460] text-sm font-medium">{profession}</p>

              <div className="flex items-center space-x-2 mt-2">
                <Badge
                  className={`${
                    isActive
                      ? 'bg-green-100 text-green-700 border-green-200'
                      : 'bg-gray-100 text-gray-600 border-gray-200'
                  } rounded-lg`}
                >
                  {isActive ? 'Ativo' : 'Inativo'}
                </Badge>
              </div>
            </div>
          </div>

          {description && <p className="text-sm text-[#511A2B]/80 mb-4 line-clamp-2 h-[2.5rem] md:h-[3rem] overflow-hidden">{description}</p>}

          <div className="space-y-3 mb-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <MapPin className="w-4 h-4 text-[#511A2B]/60" />
                <span className="text-sm text-[#511A2B]/70">Localização</span>
              </div>
              <span className="text-sm text-[#511A2B] font-medium">
                {address.district}, {address.city}
              </span>
            </div>

            {availableDays && availableDays.length > 0 && (
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Clock className="w-4 h-4 text-[#511A2B]/60" />
                  <span className="text-sm text-[#511A2B]/70">Disponibilidade</span>
                </div>
                <span className="text-sm text-[#511A2B] font-medium">{formatAvailableDays(availableDays)}</span>
              </div>
            )}
          </div>

          {/* Social Media */}
          <div className="flex space-x-2 mb-4">
            {socialMedia?.linkedin && (
              <Button
                variant="ghost"
                size="lg"
                className="rounded-full w-8 h-8 p-0"
                onClick={() => window.open(socialMedia.linkedin, '_blank')}
              >
                <Linkedin className="w-4 h-4" />
                <span className="sr-only">LinkedIn</span>
              </Button>
            )}
            {socialMedia?.instagram && (
              <Button
                variant="ghost"
                size="lg"
                className="rounded-full w-8 h-8 p-0"
                onClick={() => window.open(socialMedia.instagram, '_blank')}
              >
                <Instagram className="w-4 h-4" />
                <span className="sr-only">Instagram</span>
              </Button>
            )}
            {socialMedia?.whatsapp && (
              <Button
                variant="ghost"
                size="lg"
                className="rounded-full w-8 h-8 p-0"
                onClick={() => window.open(`https://wa.me/${socialMedia.whatsapp.replace(/\D/g, '')}`, '_blank')}
              >
                <MessageCircle className="w-4 h-4" />
                <span className="sr-only">WhatsApp</span>
              </Button>
            )}
            <Button
              variant="ghost"
              size="lg"
              className="rounded-full w-8 h-8 p-0 md:hidden flex"
              onClick={() => window.open(`tel:${phone}`, '_blank')}
            >
              <Phone className="w-4 h-4" />
              <span className="sr-only">Telefone</span>
            </Button>
          </div>

          <div className="flex">
            <Button
              className="flex-1 rounded-xl"
              onClick={() => setIsModalOpen(true)}
            >
              <User2 className="w-4 h-4 mr-2" />
              Ver perfil
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
