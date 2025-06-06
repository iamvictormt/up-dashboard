import { AddressData } from './address';

export interface CreateEventData {
  name: string;
  description: string;
  date: string;
  type: string;
  points: number;
  totalSpots: number;
  address: AddressData;
  storeId: string;
}

export interface UpdateEventData {
  name: string;
  description: string;
  date: string;
  type: string;
  points: number;
  totalSpots: number;
  address: AddressData;
}

export interface EventData {
  id?: string;
  name: string;
  description: string;
  date: string;
  type: string;
  points: number;
  totalSpots: number;
  filledSpots?: number;
  participantsCount?: number;
  address: AddressData;
  storeId?: string;
}
