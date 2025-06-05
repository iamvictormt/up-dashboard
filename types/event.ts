import { AddressData } from './address';

export interface EventData {
  name: string;
  description: string;
  date: string;
  type: string;
  points: number;
  totalSpots: number;
  filledSpots: number;
  participantsCount: number;
  address: AddressData;
}
