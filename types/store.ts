import { AddressData } from './address';
import { EventData } from './event';
import { ProductData } from './product';
import { PartnerSupplierType } from './partnerSupplier';

export interface StoreData {
  id?: string;
  logoUrl?: string;
  name: string;
  description: string;
  website: string;
  rating: number;
  openingHours: string;
  address: AddressData;
  products: ProductData[];
  events: EventData[];
  type?: PartnerSupplierType;
  isVerified?: boolean;
  isFavorite?: boolean;
}
