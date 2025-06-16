'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Loader2, XCircle, CheckCircle2, CreditCard, Shield, RefreshCw } from 'lucide-react';

export default function PaymentConfirmationContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [sessionData, setSessionData] = useState<any>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const sessionId = searchParams.get('session_id');

    if (!sessionId) {
      setStatus('error');
      return;
    }

    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 90) {
          clearInterval(progressInterval);
          return 90;
        }
        return prev + 10;
      });
    }, 200);

    setTimeout(() => {
      fetch(`/api/checkout/session?session_id=${sessionId}`)
        .then((res) => res.json())
        .then((data) => {
          clearInterval(progressInterval);
          setProgress(100);

          setTimeout(() => {
            if (data.status === 'complete') {
              setStatus('success');
              setSessionData(data);
            } else {
              setStatus('error');
            }
          }, 500);
        })
        .catch(() => {
          clearInterval(progressInterval);
          setStatus('error');
        });
    }, 2000);

    return () => clearInterval(progressInterval);
  }, [searchParams]);

  useEffect(() => {
    if (status === 'success') {
      router.push('/payment-confirmed');
    }
  }, [status, router]);

  if (status === 'loading') {
    return (
      <div className="p-6 md:p-8 w-full">
        <div className="bg-white/60 backdrop-blur-sm rounded-3xl p-6 md:p-8 border border-[#511A2B]/10 shadow-lg w-[30%] place-self-center">
          <Card className="w-full max-w-md border-0 shadow-2xl bg-white/90 backdrop-blur-sm rounded-3xl">
            <CardContent className="p-8">
              <div className="text-center space-y-6">
                {/* Animated Icon */}
                <div className="relative">
                  <div className="w-20 h-20 mx-auto bg-gradient-to-r from-[#46142b] to-[#5a1a35] rounded-full flex items-center justify-center">
                    <CreditCard className="w-10 h-10 text-white" />
                  </div>
                  <div className="absolute inset-0 w-20 h-20 mx-auto border-4 border-[#46142b]/20 rounded-full animate-ping" />
                </div>

                {/* Title */}
                <div className="space-y-2">
                  <h1 className="text-2xl font-bold bg-gradient-to-r from-[#46142b] to-[#5a1a35] bg-clip-text text-transparent">
                    Processando Pagamento
                  </h1>
                  <p className="text-slate-600">Aguarde enquanto confirmamos sua transação</p>
                </div>

                {/* Progress Bar */}
                <div className="space-y-3">
                  <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-[#46142b] to-[#5a1a35] rounded-full transition-all duration-300 ease-out"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                  <p className="text-sm text-slate-500">{progress}% concluído</p>
                </div>

                {/* Loading Steps */}
                <div className="space-y-3 text-left">
                  {[
                    { step: 'Verificando dados do pagamento', completed: progress > 30 },
                    { step: 'Confirmando com o banco', completed: progress > 60 },
                    { step: 'Ativando sua assinatura', completed: progress > 90 },
                  ].map((item, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <div
                        className={`w-5 h-5 rounded-full flex items-center justify-center transition-all duration-300 ${
                          item.completed
                            ? 'bg-green-500 text-white'
                            : progress > (index + 1) * 30 - 15
                            ? 'bg-[#46142b] text-white animate-pulse'
                            : 'bg-slate-200'
                        }`}
                      >
                        {item.completed ? (
                          <CheckCircle2 className="w-3 h-3" />
                        ) : progress > (index + 1) * 30 - 15 ? (
                          <Loader2 className="w-3 h-3 animate-spin" />
                        ) : (
                          <div className="w-2 h-2 bg-slate-400 rounded-full" />
                        )}
                      </div>
                      <span
                        className={`text-sm transition-colors duration-300 ${
                          item.completed ? 'text-green-600 font-medium' : 'text-slate-600'
                        }`}
                      >
                        {item.step}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Security Badge */}
                <div className="flex items-center justify-center gap-2 text-xs text-slate-500 bg-slate-50 rounded-lg p-3">
                  <Shield className="w-4 h-4" />
                  <span>Transação protegida por criptografia SSL</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (status === 'error') {
    return (
      <div className="p-6 md:p-8 w-full">
        <div className="bg-white/60 backdrop-blur-sm rounded-3xl p-6 md:p-8 border border-[#511A2B]/10 shadow-lg w-full">
          <Card className="w-full max-w-md border-0 shadow-2xl bg-white">
            <CardContent className="p-8">
              <div className="text-center space-y-6">
                {/* Error Icon */}
                <div className="w-20 h-20 mx-auto bg-gradient-to-r from-red-500 to-red-600 rounded-full flex items-center justify-center">
                  <XCircle className="w-10 h-10 text-white" />
                </div>

                {/* Title */}
                <div className="space-y-2">
                  <h1 className="text-2xl font-bold text-slate-800">Ops! Algo deu errado</h1>
                  <p className="text-slate-600">
                    Não conseguimos processar seu pagamento. Mas não se preocupe, nenhum valor foi cobrado.
                  </p>
                </div>

                {/* Error Details */}
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <p className="text-sm text-red-700">
                    <strong>Possíveis causas:</strong>
                    <br />• Dados do cartão incorretos
                    <br />• Limite insuficiente
                    <br />• Problema temporário no sistema
                  </p>
                </div>

                {/* Action Buttons */}
                <div className="space-y-3">
                  <Button
                    onClick={() => router.push('/plans')}
                    className="w-full bg-gradient-to-r from-[#46142b] to-[#5a1a35] hover:from-[#5a1a35] hover:to-[#46142b] text-white h-12"
                  >
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Tentar Novamente
                  </Button>
                  <Button variant="outline" onClick={() => router.push('/help')} className="w-full h-12">
                    Contatar Suporte
                  </Button>
                </div>

                {/* Help Text */}
                <p className="text-xs text-slate-500">
                  Precisa de ajuda? Nossa equipe está disponível 24/7 para te auxiliar
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }
}
