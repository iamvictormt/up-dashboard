'use client';

import { useState } from 'react';
import { Star, MapPin, Building, MoreHorizontal } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Image from 'next/image';
import Link from 'next/link';

interface Supplier {
  id: string;
  tradeName: string;
  companyName: string;
  document: string;
  stateRegistration: string;
  contact: string;
  profileImage: string;
  store: {
    id: string;
    name: string;
    description: string | null;
    website: string | null;
    rating: number;
    openingHours: string | null;
    address: {
      state: string;
      city: string;
      district: string;
      street: string;
      complement: string | null;
      number: string;
      zipCode: string;
    };
  };
  category: string;
  mainImage: string;
  thumbnails: string[];
  available: string;
  duration: string;
  contactName: string;
  reviews: number;
}

interface SupplierCardProps {
  supplier: Supplier;
}

export function SupplierCard({ supplier }: SupplierCardProps) {
  const [selectedImage, setSelectedImage] = useState(supplier.mainImage);

  const { id, tradeName, store, category, mainImage, thumbnails, reviews } = supplier;

  const { rating, address } = store;

  return (
    <Card className="bg-white/80 backdrop-blur-sm border-[#511A2B]/10 rounded-2xl hover:border-[#511A2B]/30 transition-all duration-300 shadow-sm hover:shadow-lg overflow-hidden">
      <CardContent className="p-0">
        {/* Image Section */}
        <div className="relative">
          {/* Main Image */}
          <div className="relative h-48 overflow-hidden rounded-t-2xl">
            <Image
              src={selectedImage || '/placeholder.svg'}
              alt={tradeName}
              fill
              className="object-cover transition-transform duration-300 hover:scale-105"
            />

            {/* Rating Overlay */}
            <div className="absolute top-4 right-4 bg-[#FEC460] text-[#511A2B] px-2 py-1 rounded-lg flex items-center space-x-1">
              <Star className="w-4 h-4 fill-current" />
              <span className="font-semibold text-sm">{rating.toFixed(1)}</span>
            </div>
          </div>
        </div>

        {/* Content Section */}
        <div className="p-6">
          {/* Posted Date */}
          <p className="text-xs text-[#511A2B]/50 mb-2">
            Posted date:{' '}
            {new Date().toLocaleDateString('en-GB', {
              day: '2-digit',
              month: 'short',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
            })}
          </p>

          {/* Title */}
          <h3 className="text-lg font-bold text-[#511A2B] mb-2 line-clamp-1">{tradeName}</h3>

          {/* Category */}
          <Badge className="bg-[#FEC460]/20 text-[#D56235] hover:bg-[#FEC460]/30 rounded-lg mb-3 border-[#FEC460]/30">
            {category}
          </Badge>

          {/* Description */}
          {store.description && <p className="text-sm text-[#511A2B]/80 mb-4 line-clamp-2">{store.description}</p>}

          {/* Location */}
          <div className="flex items-center space-x-2 mb-3">
            <MapPin className="w-4 h-4 text-red-500" />
            <span className="text-sm text-[#511A2B] font-medium">
              {address.city}, {address.state}
            </span>
          </div>

          {/* Company Info */}
          <div className="flex items-center space-x-2 mb-3">
            <Building className="w-4 h-4 text-blue-500" />
            <span className="text-sm text-[#511A2B]">{supplier.companyName}</span>
          </div>

          {/* Reviews */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <Star className="w-4 h-4 text-[#FEC460] fill-current" />
              <span className="text-sm text-[#511A2B] font-medium">
                {rating.toFixed(1)} ({reviews} reviews)
              </span>
            </div>

            <Button
              variant="ghost"
              size="icon"
              className="text-[#511A2B]/50 hover:text-[#511A2B] hover:bg-[#511A2B]/10 rounded-full"
            >
              <MoreHorizontal className="w-4 h-4" />
            </Button>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-2">
            <Button className="flex-1 bg-[#511A2B] hover:bg-[#511A2B]/90 text-white rounded-xl">Contatar</Button>
            <Link href={`/suppliers/${id}`} className="flex-1">
              <Button
                variant="outline"
                className="w-full border-[#511A2B]/30 text-[#511A2B] hover:bg-[#511A2B]/10 rounded-xl"
              >
                Ver Detalhes
              </Button>
            </Link>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
