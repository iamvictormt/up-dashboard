"use client"
import { Star, MapPin, Store, Package, Calendar, ExternalLink, Heart, Clock, ArrowRight, Sparkles } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { formatCurrency } from "@/lib/utils"

interface Supplier {
  id: string
  name: string
  logoUrl?: string | null
  description: string
  website: string
  rating: number
  openingHours: string
  address: {
    state: string
    city: string
    district: string
    street: string
    complement: string | null
    number: string
    zipCode: string
  }
  products: Array<{
    id?: string
    name: string
    description: string
    price: number
    link: string
    featured: boolean
    promotion: boolean
    photoUrl?: string | null
  }>
  events: Array<{
    id?: string
    name: string
    description: string
    date: string
    type: string
    points: number
    totalSpots: number
    filledSpots: number
    address: {
      state: string
      city: string
      district: string
      street: string
      complement: string | null
      number: string
      zipCode: string
    }
  }>
}

interface SupplierCardProps {
  supplier: Supplier
}

export function SupplierCard({ supplier }: SupplierCardProps) {
  const { id, name, description, website, rating, openingHours, address, products, events, logoUrl } = supplier

  const featuredProducts = products.filter((product) => product.featured)
  const promotionProducts = products.filter((product) => product.promotion)
  const nextEvent = events.length > 0 ? events[0] : null

  // Parse opening hours to show first day
  const firstOpeningHour = openingHours.split("|")[0]?.trim() || openingHours

  return (
    <Card className="group bg-[#511A2B] border-border/40 hover:border-primary/20 hover:shadow-2xl transition-all duration-500 overflow-hidden h-full flex flex-col relative rounded-2xl">
      {/* Decorative gradient overlay */}

      <CardContent className="p-0 flex flex-col h-full relative z-10">
        {/* Hero Section with Logo */}
        <div className="relative p-8 pb-6">
          {/* Background pattern */}
          <div className="absolute inset-0 opacity-5">
            <div
              className="absolute inset-0"
              style={{
                backgroundImage: "radial-gradient(circle at 2px 2px, currentColor 1px, transparent 0)",
                backgroundSize: "32px 32px",
              }}
            />
          </div>

          <div className="relative flex flex-col items-center text-center gap-4">
            {/* Logo with enhanced styling */}
            <div className="relative">
              {logoUrl ? (
                <div className="w-32 h-32 rounded-3xl overflow-hidden border-2 border-background shadow-2xl ring-4 ring-primary/10 group-hover:ring-primary/20 transition-all duration-500 group-hover:scale-105">
                  <img src={logoUrl || "/placeholder.svg"} alt={name} className="w-full h-full object-cover" />
                </div>
              ) : (
                <div className="w-32 h-32 rounded-3xl bg-gradient-to-br from-primary/20 to-accent/20 border-2 border-background shadow-2xl ring-4 ring-primary/10 group-hover:ring-primary/20 flex items-center justify-center transition-all duration-500 group-hover:scale-105">
                  <Store className="w-12 h-12 text-white" />
                </div>
              )}

              {/* Rating badge overlay */}
              {rating > 0 && (
                <div className="absolute -bottom-2 -right-2 bg-gradient-to-br from-amber-400 to-orange-500 text-white px-3 py-1.5 rounded-full flex items-center gap-1 shadow-lg ring-2 ring-background">
                  <Star className="w-3.5 h-3.5 fill-current" />
                  <span className="font-bold text-sm">{rating.toFixed(1)}</span>
                </div>
              )}
            </div>

            {/* Store Name */}
            <div className="space-y-2">
              <h3 className="text-2xl font-bold text-foreground text-balance leading-tight group-hover:text-primary transition-colors">
                {name}
              </h3>

              {/* Location */}
              <div className="flex items-center justify-center gap-1.5 text-muted-foreground text-sm">
                <MapPin className="w-4 h-4 flex-shrink-0" />
                <span>
                  {address.city}, {address.state}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Content Section */}
        <div className="px-6 py-6 flex-1 flex flex-col gap-6 bg-[#511A2B] hover:bg-[#511A2B]/90">
          {/* Description */}
          <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2 text-center">{description}</p>

          {/* Quick Info Pills */}
          <div className="flex flex-wrap gap-2 justify-center">
            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-muted/50 rounded-full text-xs text-muted-foreground border border-border/50">
              <Clock className="w-3.5 h-3.5" />
              <span className="font-medium">{firstOpeningHour}</span>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-muted/50 rounded-full text-xs text-muted-foreground border border-border/50">
              <Package className="w-3.5 h-3.5" />
              <span className="font-medium">{products.length} produtos</span>
            </div>
          </div>

          {/* Products Showcase */}
          {products.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-semibold text-foreground flex items-center gap-2">
                  Produtos
                </h4>
                {(featuredProducts.length > 0 || promotionProducts.length > 0) && (
                  <div className="flex gap-1.5">
                    {featuredProducts.length > 0 && (
                      <Badge variant="secondary" className="rounded-full text-xs px-2 py-0.5">
                        {featuredProducts.length} destaque
                      </Badge>
                    )}
                    {promotionProducts.length > 0 && (
                      <Badge className="bg-gradient-to-r from-red-500 to-pink-500 text-white hover:from-red-600 hover:to-pink-600 rounded-full text-xs px-2 py-0.5 border-0">
                        {promotionProducts.length} promoção
                      </Badge>
                    )}
                  </div>
                )}
              </div>

              {/* Product Grid */}
              <div className="grid grid-cols-2 gap-3">
                {products.slice(0, 4).map((product, index) => (
                  <div
                    key={product.id || index}
                    className="relative group/product bg-muted/30 hover:bg-muted/50 rounded-xl overflow-hidden border border-border/50 hover:border-primary/30 transition-all duration-300 hover:shadow-lg"
                  >
                    {/* Product Image */}
                    {product.photoUrl ? (
                      <div className="aspect-square w-full overflow-hidden bg-muted">
                        <img
                          src={product.photoUrl || "/placeholder.svg"}
                          alt={product.name}
                          className="w-full h-full object-cover group-hover/product:scale-110 transition-transform duration-500"
                        />
                      </div>
                    ) : (
                      <div className="aspect-square w-full bg-gradient-to-br from-muted to-muted/50 flex items-center justify-center">
                        <Package className="w-8 h-8 text-muted-foreground/30" />
                      </div>
                    )}

                    {/* Product Info Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover/product:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-3">
                      <p className="text-white text-xs font-medium line-clamp-1 mb-1">{product.name}</p>
                      <p className="text-white/90 text-xs font-bold">{formatCurrency(product.price)}</p>
                    </div>

                    {/* Badges */}
                    <div className="absolute top-2 right-2 flex flex-col gap-1">
                      {product.featured && (
                        <Badge className="bg-primary text-primary-foreground rounded-full text-[10px] px-2 py-0.5 shadow-lg">
                          Destaque
                        </Badge>
                      )}
                      {product.promotion && (
                        <Badge className="bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-full text-[10px] px-2 py-0.5 shadow-lg border-0">
                          Promoção
                        </Badge>
                      )}
                    </div>

                    {/* Price Tag (visible by default) */}
                    <div className="absolute bottom-2 left-2 bg-background/95 backdrop-blur-sm px-2 py-1 rounded-lg shadow-lg border border-border/50">
                      <p className="text-xs font-bold text-foreground">{formatCurrency(product.price)}</p>
                    </div>
                  </div>
                ))}
              </div>

              {products.length > 4 && (
                <p className="text-xs text-center text-muted-foreground">+{products.length - 4} produtos adicionais</p>
              )}
            </div>
          )}

          {/* Events Section */}
          {nextEvent ? (
            <div className="relative p-4 bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950/30 dark:to-teal-950/30 rounded-2xl border border-emerald-200/50 dark:border-emerald-800/50 space-y-3 overflow-hidden">
              {/* Background decoration */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-400/10 rounded-full blur-3xl" />

              <div className="relative">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-sm font-semibold text-emerald-900 dark:text-emerald-100 flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    Próximo Evento
                  </h4>
                  <Badge className="bg-emerald-500 text-white hover:bg-emerald-600 rounded-full text-xs font-medium border-0 shadow-sm">
                    {nextEvent.type}
                  </Badge>
                </div>

                <div className="space-y-2">
                  <p className="text-sm font-semibold text-emerald-950 dark:text-emerald-50 line-clamp-1">
                    {nextEvent.name}
                  </p>
                  <p className="text-xs text-emerald-700 dark:text-emerald-300 flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5" />
                    {new Date(nextEvent.date).toLocaleDateString("pt-BR", {
                      day: "2-digit",
                      month: "long",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>

                <div className="flex items-center justify-between pt-3 mt-3 border-t border-emerald-200/50 dark:border-emerald-800/50">
                  <span className="text-xs text-emerald-700 dark:text-emerald-300">
                    {nextEvent.filledSpots}/{nextEvent.totalSpots} vagas
                  </span>
                  <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5" />+{nextEvent.points} pts
                  </span>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-4 bg-muted/20 rounded-2xl border border-dashed border-border/50 flex flex-col items-center justify-center text-center space-y-2 p-[55px]">
              <Calendar className="w-6 h-6 text-muted-foreground/40" />
              <p className="text-xs text-muted-foreground">Nenhum evento no momento</p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-2 mt-auto pt-2">
            <Link href={`/suppliers-store/${id}`} className="flex-1">
              <Button className="w-full rounded-xl font-semibold shadow-md hover:shadow-xl transition-all group/btn bg-gradient-to-r from-primary to-primary/90 hover:from-primary hover:to-primary">
                Ver Loja Completa
                <ArrowRight className="w-4 h-4 ml-2 group-hover/btn:translate-x-1 transition-transform" />
              </Button>
            </Link>
            {/* <Button
              variant="outline"
              size="icon"
              className="rounded-xl border-border/50 hover:bg-primary/10 hover:border-primary/30 transition-all bg-transparent"
              onClick={() => window.open(website, "_blank")}
            >
              <ExternalLink className="w-4 h-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="rounded-xl border-border/50 hover:bg-red-50 hover:border-red-200 hover:text-red-500 dark:hover:bg-red-950/30 transition-all bg-transparent"
            >
              <Heart className="w-4 h-4" />
            </Button> */}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
