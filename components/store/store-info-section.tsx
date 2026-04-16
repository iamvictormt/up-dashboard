import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MapPin, Clock, Store, Globe } from 'lucide-react';
import MapCard from '../map-card';
import { processStoreHours } from '@/utils/hours';
import { StoreData } from '@/types';

interface StoreInfoSectionProps {
  storeData: StoreData;
  isWellness?: boolean;
}

export default function StoreInfoSection({ storeData, isWellness = false }: StoreInfoSectionProps) {
  const storeHours = processStoreHours(storeData.openingHours);
  const title = isWellness ? 'Informações do Espaço Wellness' : 'Informações da Loja';
  const subtitle = isWellness
    ? 'Conheça os detalhes do espaço, localização e horários para agendar seus serviços'
    : 'Conheça mais detalhes sobre nossa loja, localização e horários de funcionamento';
  const locationSubtitle = isWellness ? 'Onde você pode vivenciar os serviços' : 'Onde nos encontrar';
  const regionTitle = isWellness ? 'Área de Atendimento' : 'Região';
  const referenceTitle = isWellness ? 'Ponto de Referência' : 'Referência';
  const referenceText = `Próximo ao centro de ${storeData.address.district}`;
  const scheduleTitle = isWellness ? 'Horário de Atendimento' : 'Horário de Funcionamento';
  const scheduleSubtitle = isWellness ? 'Quando os serviços estão disponíveis' : 'Quando estamos abertos';

  return (
    <section>
      <div className="text-center mb-12">
        <h2 className="text-2xl md:text-3xl font-bold text-[#511A2B] mb-4">{title}</h2>
        <p className="text-[#511A2B]/70 max-w-2xl mx-auto">{subtitle}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="bg-white border-0 shadow-lg rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-300 flex flex-col">
          <CardHeader className="bg-[#46142b] text-white p-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                <MapPin className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">Localização</h3>
                <p className="text-white/90 text-sm">{locationSubtitle}</p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-6 flex-1">
            <div className="relative w-full h-48 bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl overflow-hidden mb-6">
              <MapCard cep={storeData.address.zipCode} />
            </div>

            <div className="space-y-5">
              <AddressItem
                icon={<MapPin className="w-5 h-5 text-[#511A2B]" />}
                title="Endereço Completo"
                lines={[
                  `${storeData.address.street}, ${storeData.address.number}${
                    storeData.address.complement ? ', ' + storeData.address.complement : ''
                  }`,
                  `${storeData.address.district}, ${storeData.address.city} - ${storeData.address.state}`,
                  `CEP: ${storeData.address.zipCode}`,
                ]}
                iconBackgroundClass="bg-[#511A2B]/10"
              />

              <AddressItem
                icon={<Globe className="w-5 h-5 text-[#D56235]" />}
                title={regionTitle}
                lines={[
                  `${storeData.address.city} - ${storeData.address.state}`,
                  `Bairro: ${storeData.address.district}`,
                ]}
                iconBackgroundClass="bg-[#D56235]/10"
              />

              <AddressItem
                icon={<Store className="w-5 h-5 text-[#FEC460]" />}
                title={referenceTitle}
                lines={[`${storeData.name} - ${storeData.address.street}`, referenceText]}
                iconBackgroundClass="bg-[#FEC460]/10"
              />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white border-0 shadow-lg rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-300 flex flex-col">
          <CardHeader className="bg-[#46142b] text-white p-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                <Clock className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">{scheduleTitle}</h3>
                <p className="text-white/90 text-sm">{scheduleSubtitle}</p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-6 flex-1 flex flex-col">
            <div className="space-y-3 mb-6 flex-1">
              {storeHours.weekSchedule.map((schedule, index) => {
                const isToday = storeHours.currentDay === index;
                const isClosed = schedule.hours === 'Fechado';

                return (
                  <div
                    key={index}
                    className={`flex items-center justify-between p-3 rounded-xl transition-colors ${
                      isToday ? 'bg-[#511A2B]/10 border border-[#511A2B]/20' : 'bg-gray-50'
                    }`}
                  >
                    <span className={`font-medium ${isToday ? 'text-[#511A2B] font-bold' : 'text-[#511A2B]'}`}>
                      {schedule.day}
                      {isToday && (
                        <span className="ml-2 text-xs bg-[#511A2B] text-white px-2 py-1 rounded-full">Hoje</span>
                      )}
                    </span>
                    <Badge
                      variant="secondary"
                      className={`px-3 py-1 ${
                        isClosed
                          ? 'bg-red-100 text-red-700 hover:bg-red-200'
                          : isToday
                          ? 'bg-[#511A2B] text-white hover:bg-[#511A2B]/90'
                          : 'bg-[#511A2B]/10 text-[#511A2B] hover:bg-[#511A2B]/20'
                      }`}
                    >
                      {schedule.hours}
                    </Badge>
                  </div>
                );
              })}
            </div>

            <div
              className={`p-4 rounded-xl border ${
                storeHours.isOpen ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'
              }`}
            >
              <div className="flex items-center gap-2">
                <div className={`w-3 h-3 rounded-full ${storeHours.isOpen ? 'bg-green-500' : 'bg-red-500'}`}></div>
                <span className={`font-medium text-sm ${storeHours.isOpen ? 'text-green-700' : 'text-red-700'}`}>
                  {storeHours.isOpen ? 'Aberto agora' : 'Fechado agora'}
                </span>
              </div>
              <p className={`text-sm mt-1 ${storeHours.isOpen ? 'text-green-600' : 'text-red-600'}`}>
                {storeHours.isOpen && storeHours.closingTime && `Fecha às ${storeHours.closingTime}`}
                {!storeHours.isOpen && storeHours.nextOpenTime && `Abre às ${storeHours.nextOpenTime}`}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}

interface AddressItemProps {
  icon: React.ReactNode;
  title: string;
  lines: string[];
  iconBackgroundClass: string;
}

function AddressItem({ icon, title, lines, iconBackgroundClass }: AddressItemProps) {
  return (
    <div className="flex items-start gap-4">
      <div className={`w-10 h-10 ${iconBackgroundClass} rounded-full flex items-center justify-center flex-shrink-0`}>
        {icon}
      </div>
      <div>
        <h4 className="font-bold text-[#511A2B] text-lg">{title}</h4>
        {lines.map((line, idx) => (
          <p key={idx} className="text-[#511A2B]/80 mt-1 text-sm first:mt-0">
            {line}
          </p>
        ))}
      </div>
    </div>
  );
}
