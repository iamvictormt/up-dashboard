'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { fetchAdminStatistics, fetchPhysicalSales, fetchAllPartnersForAdmin, updatePartnerPointsLimit } from '@/lib/admin-api';
import { toast } from 'sonner';
import { ShoppingBag, Coins, Users, Search, Edit } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';

export function AdminDashboardContent() {
  const [stats, setStats] = useState<any>(null);
  const [physicalSales, setPhysicalSales] = useState<any[]>([]);
  const [partners, setPartners] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLimitModalOpen, setIsLimitModalOpen] = useState(false);
  const [selectedPartner, setSelectedPartner] = useState<any>(null);
  const [newLimit, setNewLimit] = useState<number>(0);
  const [view, setView] = useState<'stats' | 'sales' | 'partners'>('stats');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setIsLoading(true);
      const [statsRes, salesRes, partnersRes] = await Promise.all([
        fetchAdminStatistics(),
        fetchPhysicalSales(),
        fetchAllPartnersForAdmin()
      ]);
      setStats(statsRes.data);
      setPhysicalSales(salesRes.data);
      setPartners(partnersRes.data);
    } catch (error) {
      console.error('Error loading admin data:', error);
      toast.error('Erro ao carregar dados do painel.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenLimitModal = (partner: any) => {
    setSelectedPartner(partner);
    setNewLimit(partner.pointsLimit || 0);
    setIsLimitModalOpen(true);
  };

  const handleUpdateLimit = async () => {
    if (!selectedPartner) return;
    try {
      await updatePartnerPointsLimit(selectedPartner.id, newLimit);
      toast.success('Limite de pontos atualizado com sucesso!');
      setIsLimitModalOpen(false);
      loadData();
    } catch (error) {
      toast.error('Erro ao atualizar limite.');
    }
  };

  if (isLoading) return <div className="p-8 text-center text-[#511A2B]">Carregando...</div>;

  return (
    <div className="p-6 md:p-8 w-full max-w-7xl mx-auto space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h1 className="text-3xl font-bold text-[#511A2B]">Painel Administrativo</h1>
        <div className="flex bg-[#511A2B]/5 p-1 rounded-xl">
          <Button
            variant={view === 'stats' ? 'primary' : 'ghost'}
            onClick={() => setView('stats')}
            className="rounded-lg"
          >
            Estatísticas
          </Button>
          <Button
            variant={view === 'partners' ? 'primary' : 'ghost'}
            onClick={() => setView('partners')}
            className="rounded-lg"
          >
            Lojistas
          </Button>
          <Button
            variant={view === 'sales' ? 'primary' : 'ghost'}
            onClick={() => setView('sales')}
            className="rounded-lg"
          >
            Vendas Físicas
          </Button>
        </div>
      </div>

      {view === 'stats' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="bg-white/80 border-[#511A2B]/10 shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-[#511A2B]/70">Total de Vendas Físicas</CardTitle>
              <ShoppingBag className="h-4 w-4 text-[#511A2B]" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-[#511A2B]">{stats?.totalPhysicalSales || 0}</div>
            </CardContent>
          </Card>
          <Card className="bg-white/80 border-[#511A2B]/10 shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-[#511A2B]/70">Pontos Distribuídos (Físico)</CardTitle>
              <Coins className="h-4 w-4 text-[#511A2B]" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-[#511A2B]">{stats?.totalPointsAwardedPhysical || 0}</div>
            </CardContent>
          </Card>
          {/* Outras estatísticas podem ser adicionadas aqui se vierem da API */}
        </div>
      )}

      {view === 'partners' && (
        <Card className="bg-white/80 border-[#511A2B]/10 shadow-lg">
          <CardHeader>
            <CardTitle className="text-[#511A2B]">Gestão de Lojistas</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Lojista</TableHead>
                  <TableHead>Consumo de Pontos</TableHead>
                  <TableHead>Limite</TableHead>
                  <TableHead>Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {partners.map((partner) => (
                  <TableRow key={partner.id}>
                    <TableCell className="font-medium">{partner.tradeName}</TableCell>
                    <TableCell>
                      {partner.currentPointsAwarded || 0} / {partner.pointsLimit || 0}
                      <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                        <div
                          className="bg-[#511A2B] h-2 rounded-full"
                          style={{ width: `${Math.min(((partner.currentPointsAwarded || 0) / (partner.pointsLimit || 1)) * 100, 100)}%` }}
                        ></div>
                      </div>
                    </TableCell>
                    <TableCell>{partner.pointsLimit || 0}</TableCell>
                    <TableCell>
                      <Button variant="ghost" size="sm" onClick={() => handleOpenLimitModal(partner)}>
                        <Edit className="h-4 w-4 mr-2" />
                        Gerenciar Limite
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      {view === 'sales' && (
        <Card className="bg-white/80 border-[#511A2B]/10 shadow-lg">
          <CardHeader>
            <CardTitle className="text-[#511A2B]">Histórico de Conexão Premiada</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Código</TableHead>
                  <TableHead>Loja/Parceiro</TableHead>
                  <TableHead>Cliente</TableHead>
                  <TableHead>Valor</TableHead>
                  <TableHead>Profissional</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Data</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {physicalSales.map((sale) => (
                  <TableRow key={sale.id}>
                    <TableCell className="font-mono font-bold">{sale.code}</TableCell>
                    <TableCell>{sale.partner?.tradeName}</TableCell>
                    <TableCell>{sale.customerName}</TableCell>
                    <TableCell>{formatCurrency(sale.saleValue)}</TableCell>
                    <TableCell>{sale.redeemedByProfessional?.email || '-'}</TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${sale.status === 'REDEEMED' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                        {sale.status === 'REDEEMED' ? 'Resgatado' : 'Pendente'}
                      </span>
                    </TableCell>
                    <TableCell>{new Date(sale.createdAt).toLocaleDateString('pt-BR')}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      <Dialog open={isLimitModalOpen} onOpenChange={setIsLimitModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Gerenciar Limite de Pontos</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Lojista</Label>
              <Input value={selectedPartner?.tradeName || ''} disabled />
            </div>
            <div className="space-y-2">
              <Label>Novo Limite de Pontos</Label>
              <Input
                type="number"
                value={newLimit}
                onChange={(e) => setNewLimit(Number(e.target.value))}
              />
            </div>
            {selectedPartner && (
              <p className="text-sm text-gray-500">
                Consumo atual: {selectedPartner.currentPointsAwarded || 0} pontos.
              </p>
            )}
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setIsLimitModalOpen(false)}>Cancelar</Button>
            <Button onClick={handleUpdateLimit}>Salvar Alterações</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
