"use client"

import { useState } from "react"
import { Gift, Calendar, Package, Coins, AlertTriangle } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { BenefitModal } from "@/components/benefits/benefit-modal"
import type { BenefitData } from "@/types"

interface BenefitCardProps {
  benefit: BenefitData
  onRedeem?: (benefitId: string) => void
  isRedeeming?: boolean
}

const formatDate = (dateString?: string | null): string => {
  if (!dateString) return "Sem prazo"
  const date = new Date(dateString)
  return date.toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  })
}

const formatQuantity = (q: number | null) => {
  if (q === null) return "Ilimitada"
  if (q === 1) return "1 unidade"
  return `${q} unidades`
}

export function BenefitCard({ benefit, onRedeem, isRedeeming = false }: BenefitCardProps) {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const { name, description, pointsCost, quantity, imageUrl, expiresAt } = benefit

  const isExpiringSoon = expiresAt && new Date(expiresAt) < new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
  const isLowStock = quantity !== null && quantity <= 5 && quantity > 0
  const isOutOfStock = quantity !== null && quantity === 0

  return (
    <>
      <Card className="group relative bg-white border-[#511A2B]/10 rounded-3xl hover:border-[#511A2B]/30 transition-all duration-500 shadow-md hover:shadow-2xl overflow-hidden hover:-translate-y-1">
        <div className="absolute inset-0 bg-gradient-to-br from-[#511A2B]/0 via-transparent to-[#FEC460]/0 group-hover:from-[#511A2B]/5 group-hover:to-[#FEC460]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

        <CardContent className="relative p-0">
          {imageUrl ? (
            <div className="relative h-56 w-full overflow-hidden bg-gradient-to-br from-[#511A2B]/5 to-[#FEC460]/5">
              <img
                src={imageUrl || "/placeholder.svg"}
                alt={name}
                className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity duration-500" />

              {(isLowStock || isExpiringSoon) && !isOutOfStock && (
                <div className="absolute top-4 left-4">
                  <Badge className="bg-orange-500 text-white border-0 font-bold px-3 py-1.5 rounded-full text-xs shadow-lg flex items-center gap-1.5 animate-pulse">
                    <AlertTriangle className="w-3 h-3" />
                    {isLowStock && "Últimas unidades"}
                    {!isLowStock && isExpiringSoon && "Expirando"}
                  </Badge>
                </div>
              )}

              {/* Badge de pontos sobre a imagem */}
              <div className="absolute top-4 right-4">
                <Badge className="bg-[#511A2B] text-white border-0 font-bold px-5 py-2.5 rounded-full text-sm shadow-2xl hover:bg-[#511A2B]/90 group-hover:scale-110 transition-transform duration-300">
                  <Coins className="w-4 h-4 mr-2" />
                  {pointsCost} pts
                </Badge>
              </div>
            </div>
          ) : (
            <div className="relative h-56 w-full overflow-hidden bg-gradient-to-br from-[#511A2B]/10 to-[#FEC460]/10 flex items-center justify-center">
              <Gift className="w-20 h-20 text-[#511A2B]/20 group-hover:scale-110 transition-transform duration-500" />
              <div className="absolute top-4 right-4">
                <Badge className="bg-[#511A2B] text-white border-0 font-bold px-5 py-2.5 rounded-full text-sm shadow-2xl hover:bg-[#511A2B]/90 group-hover:scale-110 transition-transform duration-300">
                  <Coins className="w-4 h-4 mr-2" />
                  {pointsCost} pts
                </Badge>
              </div>
            </div>
          )}

          <div className="p-6">
            {/* Título */}
            <h3 className="font-bold text-[#511A2B] text-xl mb-3 capitalize line-clamp-1 group-hover:text-[#511A2B]/90 transition-colors duration-300">
              {name.toLowerCase()}
            </h3>

            {/* Descrição */}
            <p className="text-sm text-[#511A2B]/60 line-clamp-2 leading-relaxed mb-6 h-12">
              {description || "Sem descrição disponível."}
            </p>

            <div className="space-y-3 mb-6">
              {/* Quantidade */}
              <div className="flex items-start gap-3 group/item">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#511A2B]/5 to-[#511A2B]/10 flex items-center justify-center flex-shrink-0 mt-0.5 group-hover/item:scale-110 transition-transform duration-300">
                  <Package className="w-5 h-5 text-[#511A2B]" />
                </div>
                <div className="flex-1">
                  <p className="text-xs text-[#511A2B]/50 font-medium mb-0.5">Quantidade disponível</p>
                  <p
                    className={`text-sm font-semibold ${isOutOfStock ? "text-red-600" : isLowStock ? "text-orange-600" : "text-[#511A2B]"}`}
                  >
                    {isOutOfStock ? "Esgotado" : formatQuantity(quantity)}
                  </p>
                </div>
              </div>

              {/* Validade */}
              <div className="flex items-start gap-3 group/item">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#FEC460]/10 to-[#FEC460]/20 flex items-center justify-center flex-shrink-0 mt-0.5 group-hover/item:scale-110 transition-transform duration-300">
                  <Calendar className="w-5 h-5 text-[#FEC460]" />
                </div>
                <div className="flex-1">
                  <p className="text-xs text-[#511A2B]/50 font-medium mb-0.5">Válido até</p>
                  <p className={`text-sm font-semibold ${isExpiringSoon ? "text-orange-600" : "text-[#511A2B]"}`}>
                    {formatDate(expiresAt)}
                  </p>
                </div>
              </div>
            </div>

            <Button
              className="w-full rounded-xl bg-gradient-to-r from-[#511A2B] to-[#511A2B]/90 hover:from-[#511A2B]/90 hover:to-[#511A2B]/80 text-white font-semibold py-6 shadow-lg hover:shadow-xl transition-all duration-300 group/btn disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={() => setIsModalOpen(true)}
              disabled={isRedeeming || isOutOfStock}
            >
              <Gift className="w-5 h-5 mr-2 group-hover/btn:rotate-12 transition-transform duration-300" />
              {isRedeeming ? "Resgatando..." : isOutOfStock ? "Indisponível" : "Ver detalhes"}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Modal */}
      <BenefitModal
        benefit={benefit}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onRedeem={onRedeem}
        isRedeeming={isRedeeming}
      />
    </>
  )
}
