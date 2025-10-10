import api from '@/services/api';
import { CreateEventData, UpdateEventData } from '@/types';
import { AxiosResponse } from 'axios';

export async function fetchEvents(): Promise<AxiosResponse> {
  return await api.get('events');
}

export async function updateEvent(eventId: string, data: UpdateEventData): Promise<AxiosResponse> {
  return await api.patch(`events/${eventId}`, data);
}

export async function deleteEvent(eventId: string): Promise<AxiosResponse> {
  return await api.delete(`events/${eventId}`);
}

export async function registerInEvent(eventId: string, data: {professionalId: string}): Promise<AxiosResponse> {
  return await api.post(`events/${eventId}/registrations`, data);
}
