export interface Report {
  id: string;
  reason: string;
  description?: string;
  createdAt: string;

  userId: string;

  targetId: string;
  targetType: 'POST' | 'COMMENT';
}
