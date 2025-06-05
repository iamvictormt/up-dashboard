import api from '@/services/api';

// Mock data for notifications
const mockNotifications = [
  {
    id: '1',
    type: 'like' as const,
    title: 'Nova curtida',
    message: "Maria Silva curtiu seu post sobre 'Dicas de networking'",
    isRead: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 15).toISOString(), // 15 minutes ago
    user: {
      id: 'user1',
      name: 'Maria Silva',
      avatar: '/placeholder.svg?height=40&width=40',
    },
    post: {
      id: 'post1',
      title: 'Dicas de networking',
    },
  },
  {
    id: '2',
    type: 'comment' as const,
    title: 'Novo comentário',
    message: "João Santos comentou: 'Excelente post! Muito útil.'",
    isRead: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30 minutes ago
    user: {
      id: 'user2',
      name: 'João Santos',
      avatar: '/placeholder.svg?height=40&width=40',
    },
    post: {
      id: 'post2',
      title: 'Como melhorar sua presença online',
    },
  },
  {
    id: '3',
    type: 'follow' as const,
    title: 'Novo seguidor',
    message: 'Ana Costa começou a seguir você',
    isRead: true,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 hours ago
    user: {
      id: 'user3',
      name: 'Ana Costa',
      avatar: '/placeholder.svg?height=40&width=40',
    },
  },
  {
    id: '4',
    type: 'mention' as const,
    title: 'Você foi mencionado',
    message: 'Carlos Lima mencionou você em um comentário',
    isRead: true,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 4).toISOString(), // 4 hours ago
    user: {
      id: 'user4',
      name: 'Carlos Lima',
      avatar: '/placeholder.svg?height=40&width=40',
    },
    post: {
      id: 'post3',
      title: 'Discussão sobre empreendedorismo',
    },
  },
  {
    id: '5',
    type: 'like' as const,
    title: 'Nova curtida',
    message: 'Fernanda Oliveira curtiu seu comentário',
    isRead: true,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 6).toISOString(), // 6 hours ago
    user: {
      id: 'user5',
      name: 'Fernanda Oliveira',
      avatar: '/placeholder.svg?height=40&width=40',
    },
  },
];

export async function fetchNotifications() {
  const response = await api.get('notifications');
  return response.data;
}

export async function markNotificationAsRead(notificationId: string) {
  await api.patch(`notifications/read/${notificationId}`);
  return { success: true };
}

export async function markAllNotificationsAsRead() {
  await api.patch('notifications/all-read');
  return { success: true };
}

export async function getUnreadCount() {
  const unreadNotifications = mockNotifications.filter((n) => !n.isRead);
  return unreadNotifications.length;
}
