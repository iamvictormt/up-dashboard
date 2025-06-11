import { Calendar, Package, Store, Users } from 'lucide-react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';

export function NoStoreView({ onCreateStore }: { onCreateStore: () => void }) {
  return (
    <div className="p-6 md:p-8 w-full">
      <div className="bg-white/60 backdrop-blur-sm rounded-3xl p-6 md:p-8 border border-[#511A2B]/10 shadow-lg w-full text-center">
        <h1 className="text-2xl md:text-3xl font-bold text-[#511A2B] mb-2">Crie sua loja</h1>
        <p className="text-[#511A2B]/70">
          Você ainda não possui uma loja cadastrada. Configure sua loja agora e comece a vender seus produtos e serviços
          para a comunidade.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 mt-10">
          <Card className="bg-white/80 border-0 shadow-lg rounded-2xl p-6 text-center">
            <div className="w-12 h-12 bg-gradient-to-r from-[#511A2B] to-[#D56235] rounded-xl flex items-center justify-center mx-auto mb-4">
              <Package className="w-6 h-6 text-white" />
            </div>
            <h3 className="font-bold text-[#511A2B] mb-2">Produtos</h3>
            <p className="text-sm text-[#511A2B]/70">Cadastre e gerencie seus produtos</p>
          </Card>

          <Card className="bg-white/80 border-0 shadow-lg rounded-2xl p-6 text-center">
            <div className="w-12 h-12 bg-gradient-to-r from-[#FEC460] to-[#D56235] rounded-xl flex items-center justify-center mx-auto mb-4">
              <Calendar className="w-6 h-6 text-white" />
            </div>
            <h3 className="font-bold text-[#511A2B] mb-2">Eventos</h3>
            <p className="text-sm text-[#511A2B]/70">Organize workshops e eventos</p>
          </Card>

          <Card className="bg-white/80 border-0 shadow-lg rounded-2xl p-6 text-center">
            <div className="w-12 h-12 bg-gradient-to-r from-[#D56235] to-[#511A2B] rounded-xl flex items-center justify-center mx-auto mb-4">
              <Users className="w-6 h-6 text-white" />
            </div>
            <h3 className="font-bold text-[#511A2B] mb-2">Comunidade</h3>
            <p className="text-sm text-[#511A2B]/70">Conecte-se com clientes</p>
          </Card>
        </div>

        <Button
          onClick={onCreateStore}
          size="lg"
          className="bg-[#511A2B] hover:bg-[#511A2B]/90 text-white rounded-xl px-12 py-4 text-lg font-semibold shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105"
        >
          <Store className="w-6 h-6 mr-3" />
          Criar Minha Loja
        </Button>

        <p className="text-[#511A2B]/70 mt-6">É rápido e fácil! Configure sua loja em poucos minutos.</p>
      </div>
    </div>
  );
}
