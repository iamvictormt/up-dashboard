import { AddressData } from './address';
import { EventData } from './event';
import { PartnerSupplierType } from './partnerSupplier';
import { ProductData } from './product';

export interface WellnessPartnerStore {
  id: string;
  name: string;
  description: string;
  website: string;
  rating: number;
  openingHours: string;
  logoUrl: string;
  addressId: string;
  partnerId: string;
  createdAt: string;
  updatedAt: string;
  address: AddressData;
  products?: ProductData[];
  events?: EventData[];
}

export interface WellnessPartnerListItem {
  id: string;
  tradeName: string;
  companyName: string;
  document: string;
  stateRegistration: string;
  contact: string;
  type: PartnerSupplierType;
  isVerified: boolean;
  status: string;
  isDeleted: boolean;
  deletedAt: string | null;
  storeId: string | null;
  pointsLimit: number;
  currentPointsAwarded: number;
  createdAt: string;
  updatedAt: string;
  isFavorite?: boolean;
  store: WellnessPartnerStore | null;
}
