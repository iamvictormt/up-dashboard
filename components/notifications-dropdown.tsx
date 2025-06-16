'use client';

import { useState, useEffect, useRef } from 'react';
import { Bell, Check, Heart, MessageCircle, UserPlus, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Skeleton } from '@/components/ui/skeleton';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { fetchNotifications, markNotificationAsRead, markAllNotificationsAsRead } from '@/lib/notifications-api';
import { cn } from '@/lib/utils';
import { Notification } from '@/types';
import { toast } from 'sonner';

export function NotificationsDropdown() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const [showAllNotifications, setShowAllNotifications] = useState(false);
  const [hasNewNotifications, setHasNewNotifications] = useState(false);
  const lastNotificationCountRef = useRef(0);
  const checkIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  useEffect(() => {
    loadNotifications();

    checkIntervalRef.current = setInterval(checkForNewNotifications, 60000);

    return () => {
      if (checkIntervalRef.current) {
        clearInterval(checkIntervalRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (isOpen) {
      loadNotifications();
    }
  }, [isOpen]);

  // Efeito para tocar som quando há novas notificações
  useEffect(() => {
    if (unreadCount > lastNotificationCountRef.current && lastNotificationCountRef.current !== 0) {
      setHasNewNotifications(true);
      playNotificationSound();
    }

    lastNotificationCountRef.current = unreadCount;
  }, [unreadCount]);

  const checkForNewNotifications = async () => {
    try {
      const data = await fetchNotifications();
      const newUnreadCount = data.filter((n) => !n.isRead).length;

      if (newUnreadCount > lastNotificationCountRef.current && lastNotificationCountRef.current !== 0) {
        setHasNewNotifications(true);
        playNotificationSound();
      }

      setNotifications(data);
      lastNotificationCountRef.current = newUnreadCount;
    } catch (error) {
      console.error('Error checking for new notifications:', error);
    }
  };

  const playNotificationSound = () => {
    const audio = new Audio('https://actions.google.com/sounds/v1/cartoon/pop.ogg');
    audio.play();
  };

  const loadNotifications = async () => {
    try {
      setLoading(true);
      const data = await fetchNotifications();
      setNotifications(data);

      if (lastNotificationCountRef.current === 0) {
        lastNotificationCountRef.current = data.filter((n) => !n.isRead).length;
      }
    } catch (error) {
      console.error('Error loading notifications:', error);
      setNotifications([]);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsRead = async (notificationId: string) => {
    try {
      await markNotificationAsRead(notificationId);
      setNotifications((prev) =>
        prev.map((notification) =>
          notification.id === notificationId ? { ...notification, isRead: true } : notification
        )
      );
      toast.success('A notificação foi marcada como lida.');
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await markAllNotificationsAsRead();
      setNotifications((prev) => prev.map((notification) => ({ ...notification, isRead: true })));
      setHasNewNotifications(false);
      toast.success('Todas as notificações foram marcadas como lidas.');
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'like':
        return <Heart className="h-4 w-4 text-red-500" />;
      case 'comment':
        return <MessageCircle className="h-4 w-4 text-[#46142b]" />;
      case 'follow':
        return <UserPlus className="h-4 w-4 text-green-500" />;
      default:
        return <Bell className="h-4 w-4 text-gray-500" />;
    }
  };

  const NotificationItem = ({ notification }: { notification: Notification }) => (
    <div
      className={cn(
        'p-4 hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-b-0',
        !notification.isRead && 'bg-[#46142b]/5'
      )}
    >
      <div className="flex items-start gap-3">
        <div className="relative">
          <Avatar className="h-10 w-10">
            <AvatarImage src={notification.user?.avatar || '/placeholder.svg?height=40&width=40'} />
            <AvatarFallback>{notification.user?.name?.charAt(0).toUpperCase() || 'N'}</AvatarFallback>
          </Avatar>
          <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-0.5 shadow-sm">
            {getNotificationIcon(notification.type)}
          </div>
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <p className={cn('text-sm font-medium', !notification.isRead && 'text-[#46142b]')}>
                {notification.title}
              </p>
              <p className="text-sm text-gray-600 mt-1">{notification.message}</p>
              <p className="text-xs text-gray-400 mt-2">
                {formatDistanceToNow(new Date(notification.createdAt), {
                  addSuffix: true,
                  locale: ptBR,
                })}
              </p>
            </div>

            {!notification.isRead && (
              <Button
                variant="ghost"
                size="sm"
                className="h-7 w-7 p-0 rounded-full text-[#46142b] hover:bg-[#46142b]/10 hover:text-[#46142b]"
                onClick={() => handleMarkAsRead(notification.id)}
              >
                <Check className="h-4 w-4" />
                <span className="sr-only">Marcar como lida</span>
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  const NotificationSkeleton = () => (
    <div className="p-4 border-b border-gray-100">
      <div className="flex items-start gap-3">
        <Skeleton className="h-10 w-10 rounded-full" />
        <div className="flex-1">
          <Skeleton className="h-4 w-3/4 mb-2" />
          <Skeleton className="h-3 w-full mb-2" />
          <Skeleton className="h-3 w-1/2 mb-1" />
          <Skeleton className="h-2 w-16 mt-2" />
        </div>
      </div>
    </div>
  );

  return (
    <>
      <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="lg"
            className={cn(
              'relative rounded-xl text-white hover:bg-white/10 hover:text-white',
              hasNewNotifications && 'animate-pulse'
            )}
          >
            <Bell className="h-4 w-4 md:h-5 md:w-5" />
            {unreadCount > 0 && (
              <Badge
                variant="destructive"
                className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
              >
                {unreadCount > 9 ? '9+' : unreadCount}
              </Badge>
            )}
            <span className="sr-only">Notificações</span>
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end" className="w-80 p-0 border border-gray-200 shadow-md rounded-lg">
          <div className="flex items-center justify-between p-4 border-b border-gray-100">
            <h3 className="font-medium text-gray-800">Notificações</h3>
            {unreadCount > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleMarkAllAsRead}
                className="text-xs text-[#46142b] hover:text-[#46142b]/80 hover:bg-[#46142b]/10"
              >
                Marcar todas como lidas
              </Button>
            )}
          </div>

          <ScrollArea className="h-[400px]">
            {loading ? (
              <div className="divide-y divide-gray-100">
                {[1, 2, 3].map((i) => (
                  <NotificationSkeleton key={i} />
                ))}
              </div>
            ) : notifications.length > 0 ? (
              <div>
                {notifications.slice(0, 5).map((notification) => (
                  <NotificationItem key={notification.id} notification={notification} />
                ))}

                {notifications.length > 5 && (
                  <div className="p-3 text-center text-sm text-gray-500">
                    + {notifications.length - 5} notificações não mostradas
                  </div>
                )}
              </div>
            ) : (
              <div className="p-8 text-center">
                <Bell className="h-10 w-10 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500 text-sm">Nenhuma notificação</p>
              </div>
            )}
          </ScrollArea>

          {notifications.length > 0 && (
            <div className="p-3 border-t border-gray-100 bg-gray-50">
              <Button
                variant="ghost"
                size="sm"
                className="w-full text-sm text-gray-600 hover:text-[#46142b] hover:bg-gray-100"
                onClick={() => {
                  setShowAllNotifications(true);
                  setIsOpen(false);
                }}
              >
                Ver todas
              </Button>
            </div>
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog open={showAllNotifications} onOpenChange={setShowAllNotifications}>
        <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-hidden flex flex-col z-[99]">
          <DialogHeader>
            <div className="flex items-center justify-between">
              <DialogTitle>Todas as Notificações</DialogTitle>
            </div>
            {unreadCount > 0 && (
              <div className="flex justify-end mt-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleMarkAllAsRead}
                  className="text-xs text-[#46142b] border-[#46142b]/20 hover:bg-[#46142b]/10"
                >
                  Marcar todas como lidas
                </Button>
              </div>
            )}
          </DialogHeader>

          <ScrollArea className="flex-1 pr-4 overflow-auto">
            {loading ? (
              <div className="divide-y divide-gray-100">
                {[1, 2, 3, 4, 5].map((i) => (
                  <NotificationSkeleton key={i} />
                ))}
              </div>
            ) : notifications.length > 0 ? (
              <div className="divide-y divide-gray-100">
                {notifications.map((notification) => (
                  <NotificationItem key={notification.id} notification={notification} />
                ))}
              </div>
            ) : (
              <div className="p-8 text-center">
                <Bell className="h-10 w-10 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500 text-sm">Nenhuma notificação</p>
              </div>
            )}
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </>
  );
}
