'use client';

import { useState } from 'react';
import { Star, Clock, DollarSign, Linkedin, Instagram, Phone, MapPin } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ProfessionalProfileModal } from '@/components/professional-profile-modal';

interface Professional {
  id: string;
  name: string;
  profession?: string;
  specialty?: string;
  description?: string;
  phone?: string;
  email?: string;
  state?: string;
  city?: string;
  district?: string;
  street?: string;
  number?: string;
  complement?: string | null;
  zipCode?: string;
  availableDays?: { dayOfWeek: string }[];
  socialMedia?: {
    linkedin?: string;
    instagram?: string;
    whatsapp?: string | null;
  };
  rating?: number;
  reviews?: number;
  experience?: string;
  price?: string;
  avatar?: string;
  available?: boolean;
}

interface ProfessionalCardProps {
  professional: Professional;
}

// Função para formatar os dias disponíveis
const formatAvailableDays = (days?: { dayOfWeek: string }[]) => {
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

  const {
    name,
    profession,
    specialty,
    description,
    rating = 5.0,
    reviews = 0,
    experience = 'N/A',
    price = 'N/A',
    avatar,
    available = true,
    city,
    state,
    availableDays,
    socialMedia,
  } = professional;

  return (
    <>
      <Card className="bg-white/80 backdrop-blur-sm border-[#511A2B]/10 rounded-2xl hover:border-[#511A2B]/30 transition-all duration-300 shadow-sm hover:shadow-md">
        <CardContent className="p-6">
          <div className="flex items-start space-x-4 mb-4">
            <Avatar className="w-16 h-16 rounded-xl">
              <AvatarImage src={avatar || '/placeholder.svg'} />
              <AvatarFallback className="rounded-xl bg-[#511A2B] text-white text-lg">
                {name
                  .split(' ')
                  .map((n) => n[0])
                  .join('')}
              </AvatarFallback>
            </Avatar>

            <div className="flex-1">
              <h3 className="font-semibold text-[#511A2B] text-lg">{name}</h3>
              <p className="text-[#FEC460] text-sm font-medium">{profession || specialty}</p>

              <div className="flex items-center space-x-4 mt-2">
                <div className="flex items-center space-x-1">
                  <Star className="w-4 h-4 text-yellow-500 fill-current" />
                  <span className="text-sm text-[#511A2B] font-medium">{rating}</span>
                  <span className="text-sm text-[#511A2B]/60">({reviews})</span>
                </div>

                <Badge
                  className={`${
                    available
                      ? 'bg-green-100 text-green-700 border-green-200'
                      : 'bg-gray-100 text-gray-600 border-gray-200'
                  } rounded-lg`}
                >
                  {available ? 'Disponível' : 'Indisponível'}
                </Badge>
              </div>
            </div>
          </div>

          {description && <p className="text-sm text-[#511A2B]/80 h-[4rem] line-clamp-2">{description}</p>}

          <div className="space-y-3 mb-4 mt">
            {(city || state) && (
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <MapPin className="w-4 h-4 text-[#511A2B]/60" />
                  <span className="text-sm text-[#511A2B]/70">Localização</span>
                </div>
                <span className="text-sm text-[#511A2B] font-medium">{[city, state].filter(Boolean).join(', ')}</span>
              </div>
            )}

            {availableDays && availableDays.length > 0 && (
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Clock className="w-4 h-4 text-[#511A2B]/60" />
                  <span className="text-sm text-[#511A2B]/70">Disponibilidade</span>
                </div>
                <span className="text-sm text-[#511A2B] font-medium">{formatAvailableDays(availableDays)}</span>
              </div>
            )}

            {experience && (
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Clock className="w-4 h-4 text-[#511A2B]/60" />
                  <span className="text-sm text-[#511A2B]/70">Experiência</span>
                </div>
                <span className="text-sm text-[#511A2B] font-medium">{experience}</span>
              </div>
            )}

            {price && (
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <DollarSign className="w-4 h-4 text-[#511A2B]/60" />
                  <span className="text-sm text-[#511A2B]/70">Consulta</span>
                </div>
                <span className="text-sm text-[#511A2B] font-semibold">{price}</span>
              </div>
            )}
          </div>

          {/* Social Media */}
          <div className="flex space-x-2 mb-4">
            <Button
              disabled={socialMedia && !socialMedia.linkedin}
              className="w-8 h-8 p-0 transition-all duration-300 hover:shadow-lg hover:translate-y-[-2px] text-white rounded-full"
              onClick={() => window.open(socialMedia?.linkedin, '_blank')}
            >
              <Linkedin className="w-4 h-4" />
              <span className="sr-only">LinkedIn</span>
            </Button>
            <Button
              disabled={socialMedia && !socialMedia.instagram}
              className="w-8 h-8 p-0 transition-all duration-300 hover:shadow-lg hover:translate-y-[-2px] text-white rounded-full"
              onClick={() => window.open(`https://instagram.com/${socialMedia.instagram.replace('@', '')}`, '_blank')}
            >
              <Instagram className="w-4 h-4" />
              <span className="sr-only">Instagram</span>
            </Button>
            <Button
              disabled={socialMedia && !socialMedia.whatsapp}
              className="w-8 h-8 p-0 transition-all duration-300 hover:shadow-lg hover:translate-y-[-2px] text-white rounded-full"
              onClick={() => window.open(`tel:${professional.phone}`, '_blank')}
            >
              <Phone className="w-4 h-4" />
              <span className="sr-only">Phone</span>
            </Button>
          </div>

          <div className="flex space-x-2 justify-center">
            <Button
              size="lg"
              disabled={!available}
              className="bg-[#511A2B] hover:bg-[#511A2B]/90 transition-all duration-300 hover:shadow-lg hover:translate-y-[-2px] text-white rounded-xl px-6"
              onClick={() => setIsModalOpen(true)}
            >
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
