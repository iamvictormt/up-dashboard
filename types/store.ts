import { AddressData } from './address';
import { EventData } from './event';
import { ProductData } from './product';

export interface StoreData {
  id: string;
  name?: string;
  description?: string;
  website: string;
  rating: number;
  openingHours: string;
  address: AddressData;
  products: ProductData[];
  events: EventData[];
}
