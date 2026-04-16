'use client';

import { useMemo, useState } from 'react';
import { Edit3, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Progress } from '@/components/ui/progress';
import { PointsLimitModal } from './points-limit-modal';
import type { WellnessPartnerListItem } from '@/types';

interface AdminPartnersTableProps {
  partners: WellnessPartnerListItem[];
  onPartnerUpdated: (partner: WellnessPartnerListItem) => void;
}

export function AdminPartnersTable({ partners, onPartnerUpdated }: AdminPartnersTableProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPartner, setSelectedPartner] = useState<WellnessPartnerListItem | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const filteredPartners = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return partners;

    return partners.filter((partner) => {
      return (
        partner.tradeName.toLowerCase().includes(query) ||
        partner.companyName.toLowerCase().includes(query) ||
        partner.document.toLowerCase().includes(query)
      );
    });
  }, [partners, searchQuery]);

  const openModal = (partner: WellnessPartnerListItem) => {
    setSelectedPartner(partner);
    setIsModalOpen(true);
  };

  const handleSaved = (updatedPartner: WellnessPartnerListItem) => {
    onPartnerUpdated(updatedPartner);
    setSelectedPartner(updatedPartner);
  };

  return (
    <>
      <div className="rounded-2xl border border-[#511A2B]/10 bg-white p-5 shadow-sm">
        <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-lg font-semibold text-[#511A2B]">Gestão de parceiros wellness</h2>
            <p className="text-sm text-[#511A2B]/70">Defina e acompanhe o limite de pontos por parceiro.</p>
          </div>

          <div className="relative w-full md:w-80">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#511A2B]/50" />
            <Input
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              placeholder="Buscar parceiro por nome ou CNPJ"
              className="h-10 border-[#511A2B]/20 bg-white pl-9 text-[#511A2B]"
            />
          </div>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Parceiro</TableHead>
              <TableHead>CNPJ</TableHead>
              <TableHead>Consumo</TableHead>
              <TableHead>Progresso</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredPartners.length > 0 ? (
              filteredPartners.map((partner) => {
                const pointsLimit = partner.pointsLimit || 0;
                const currentPointsAwarded = partner.currentPointsAwarded || 0;
                const percent =
                  pointsLimit > 0
                    ? Math.min((currentPointsAwarded / pointsLimit) * 100, 100)
                    : 0;

                return (
                  <TableRow key={partner.id}>
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="font-semibold text-[#511A2B]">{partner.tradeName}</span>
                        <span className="text-xs text-[#511A2B]/60">{partner.companyName}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-[#511A2B]/80">{partner.document}</TableCell>
                    <TableCell>
                      <div className="flex flex-col text-sm text-[#511A2B]">
                        <span>
                          {currentPointsAwarded.toLocaleString('pt-BR')} / {pointsLimit.toLocaleString('pt-BR')}
                        </span>
                        {pointsLimit > 0 && (
                          <span className="text-xs text-[#511A2B]/60">{percent.toFixed(1)}% utilizado</span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1.5">
                        <Progress value={percent} />
                        <Badge
                          className={
                            percent >= 100
                              ? 'bg-red-100 text-red-700 border-red-200'
                              : percent >= 80
                              ? 'bg-yellow-100 text-yellow-700 border-yellow-200'
                              : 'bg-emerald-100 text-emerald-700 border-emerald-200'
                          }
                        >
                          {percent >= 100 ? 'Limite atingido' : percent >= 80 ? 'Próximo do limite' : 'Dentro do limite'}
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button size="sm" onClick={() => openModal(partner)}>
                        <Edit3 className="mr-2 h-4 w-4" />
                        Gerenciar limite
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="h-20 text-center text-[#511A2B]/60">
                  Nenhum parceiro wellness encontrado.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <PointsLimitModal
        partner={selectedPartner}
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSaved={handleSaved}
      />
    </>
  );
}
