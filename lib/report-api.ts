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
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 300));

  // In a real implementation, this would be:
  // const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/reports`, {
  //   method: 'POST',
  //   headers: { 'Content-Type': 'application/json' },
  //   body: JSON.stringify(data)
  // })
  // return response.json()

  // Return mock created report
  const newReport: Report = {
    id: `report_${Date.now()}`,
    reason: data.reason,
    description: data.description,
    createdAt: new Date().toISOString(),
    userId: 'current_user',
    targetId: data.targetId,
    targetType: data.targetType,
  };

  return newReport;
}
