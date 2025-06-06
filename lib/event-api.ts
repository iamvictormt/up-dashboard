import api from '@/services/api';
import { CreateEventData } from '@/types';
import { AxiosResponse } from 'axios';

export async function createEvent(data: CreateEventData): Promise<AxiosResponse> {
  return await api.post('events', data);
}

export async function updateEvent(eventId: string, data: CreateEventData): Promise<AxiosResponse> {
  return await api.patch(`events/${eventId}`, data);
}

export async function deleteEvent(eventId: string): Promise<AxiosResponse> {
  return await api.delete(`events/${eventId}`);
}
