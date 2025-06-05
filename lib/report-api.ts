import api from '@/services/api';

export interface CreateReportData {
  targetId: string;
  targetType: 'POST' | 'COMMENT';
  reason: string;
  description?: string;
}

export interface Report {
  id: string;
  reason: string;
  description?: string;
  createdAt: string;
  userId: string;
  targetId: string;
  targetType: string;
}

export async function createReport(data: CreateReportData): Promise<Report> {
  const newReport: CreateReportData = {
    reason: data.reason,
    description: data.description,
    targetId: data.targetId,
    targetType: data.targetType,
  };

  const response = await api.post('reports', newReport);

  return response.data;
}
