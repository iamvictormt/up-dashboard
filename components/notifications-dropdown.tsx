"use client"

import { useState, useEffect, useRef } from "react"
import { Bell, Check, Heart, MessageCircle, UserPlus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { formatDistanceToNow } from "date-fns"
import { ptBR } from "date-fns/locale"
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { fetchNotifications, markNotificationAsRead, markAllNotificationsAsRead } from "@/lib/notifications-api"
import { cn } from "@/lib/utils"
import type { Notification } from "@/types"
import { toast } from "sonner"

export function NotificationsDropdown() {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [loading, setLoading] = useState(true)
  const [isOpen, setIsOpen] = useState(false)
  const [showAllNotifications, setShowAllNotifications] = useState(false)
  const [hasNewNotifications, setHasNewNotifications] = useState(false)
  const lastNotificationCountRef = useRef(0)
  const checkIntervalRef = useRef<NodeJS.Timeout | null>(null)

  const unreadCount = notifications.filter((n) => !n.isRead).length

  useEffect(() => {
    loadNotifications()
    checkIntervalRef.current = setInterval(checkForNewNotifications, 600000)

    return () => {
      if (checkIntervalRef.current) {
        clearInterval(checkIntervalRef.current)
      }
    }
  }, [])

  useEffect(() => {
    if (isOpen) {
      loadNotifications()
    }
  }, [isOpen])

  useEffect(() => {
    if (unreadCount > lastNotificationCountRef.current && lastNotificationCountRef.current !== 0) {
      setHasNewNotifications(true)
      playNotificationSound()
    }
    lastNotificationCountRef.current = unreadCount
  }, [unreadCount])

  const checkForNewNotifications = async () => {
    try {
      const data = await fetchNotifications()
      const newUnreadCount = data.filter((n) => !n.isRead).length
      if (newUnreadCount > lastNotificationCountRef.current && lastNotificationCountRef.current !== 0) {
        setHasNewNotifications(true)
        playNotificationSound()
      }
      setNotifications(data)
      lastNotificationCountRef.current = newUnreadCount
    } catch (error) {
      console.error("Error checking for new notifications:", error)
    }
  }

  const playNotificationSound = () => {
    const audio = new Audio("https://actions.google.com/sounds/v1/cartoon/pop.ogg")
    audio.play()
  }

  const loadNotifications = async () => {
    try {
      setLoading(true)
      const data = await fetchNotifications()
      setNotifications(data)
      if (lastNotificationCountRef.current === 0) {
        lastNotificationCountRef.current = data.filter((n) => !n.isRead).length
      }
    } catch (error) {
      console.error("Error loading notifications:", error)
      setNotifications([])
    } finally {
      setLoading(false)
    }
  }

  const handleMarkAsRead = async (notificationId: string) => {
    try {
      await markNotificationAsRead(notificationId)
      setNotifications((prev) =>
        prev.map((notification) =>
          notification.id === notificationId ? { ...notification, isRead: true } : notification,
        ),
      )
      toast.success("Notificação marcada como lida")
    } catch (error) {
      console.error("Error marking notification as read:", error)
    }
  }

  const handleMarkAllAsRead = async () => {
    try {
      await markAllNotificationsAsRead()
      setNotifications((prev) => prev.map((notification) => ({ ...notification, isRead: true })))
      setHasNewNotifications(false)
      toast.success("Todas as notificações foram marcadas como lidas")
    } catch (error) {
      console.error("Error marking all notifications as read:", error)
    }
  }

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "like":
        return <Heart className="h-3.5 w-3.5 text-red-500" fill="currentColor" />
      case "comment":
        return <MessageCircle className="h-3.5 w-3.5 text-[#46142b]" />
      case "follow":
        return <UserPlus className="h-3.5 w-3.5 text-green-500" />
      default:
        return <Bell className="h-3.5 w-3.5 text-gray-400" />
    }
  }

  const NotificationItem = ({ notification }: { notification: Notification }) => (
    <div
      className={cn(
        "group p-4 hover:bg-gray-50 transition-all duration-200 border-b border-gray-100 last:border-b-0",
        !notification.isRead && "bg-[#511A2B]/5",
      )}
    >
      <div className="flex items-start gap-3">
        <div className="relative flex-shrink-0">
          <Avatar className="h-10 w-10 border-2 border-white shadow-sm">
            <AvatarImage src={notification.user?.avatar || "/placeholder.svg?height=40&width=40"} />
            <AvatarFallback className="bg-gradient-to-br from-[#511A2B] to-[#46142b] text-white text-sm font-medium">
              {notification.user?.name?.charAt(0).toUpperCase() || "N"}
            </AvatarFallback>
          </Avatar>
          <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-1 shadow-sm border border-gray-100">
            {getNotificationIcon(notification.type)}
          </div>
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1">
              <p
                className={cn(
                  "text-sm leading-snug mb-1",
                  !notification.isRead ? "text-gray-900 font-semibold" : "text-gray-700 font-medium",
                )}
              >
                {notification.title}
              </p>
              <p className="text-sm text-gray-600 leading-relaxed">{notification.message}</p>
              <p className="text-xs text-gray-400 mt-2 font-medium">
                {formatDistanceToNow(new Date(notification.createdAt), {
                  addSuffix: true,
                  locale: ptBR,
                })}
              </p>
            </div>

            {!notification.isRead && (
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 rounded-full text-[#46142b] hover:bg-[#46142b]/10 hover:text-[#46142b] opacity-0 group-hover:opacity-100 transition-all"
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
  )

  return (
    <>
      <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className={cn(
              "relative text-white/90 hover:text-white hover:bg-white/10 transition-all",
              hasNewNotifications && "animate-pulse",
              unreadCount > 0 &&
                "after:absolute after:top-1.5 after:right-1.5 after:w-2 after:h-2 after:bg-red-500 after:rounded-full",
            )}
          >
            <Bell className="h-5 w-5" />
            {unreadCount > 0 && (
              <Badge
                variant="destructive"
                className="absolute -top-1.5 -right-1.5 h-5 min-w-[20px] flex items-center justify-center px-1 text-[10px] font-bold shadow-lg"
              >
                {unreadCount > 9 ? "9+" : unreadCount}
              </Badge>
            )}
            <span className="sr-only">Notificações</span>
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent className="w-[360px] sm:w-96 p-0 bg-white shadow-xl border-gray-200" align="end">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 bg-gray-50">
            <h3 className="font-semibold text-gray-900 text-sm">Notificações</h3>
            {unreadCount > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleMarkAllAsRead}
                className="text-xs text-[#46142b] hover:text-[#46142b] hover:bg-[#46142b]/10 h-7 px-2 font-medium"
              >
                Marcar todas como lidas
              </Button>
            )}
          </div>

          {/* Content */}
          <ScrollArea className="h-[420px]">
            {!loading && notifications.length > 0 ? (
              <div>
                {notifications.slice(0, 5).map((notification) => (
                  <NotificationItem key={notification.id} notification={notification} />
                ))}
                {notifications.length > 5 && (
                  <div className="px-4 py-3 text-center bg-gray-50">
                    <p className="text-xs text-gray-500 font-medium">
                      + {notifications.length - 5} notificações adicionais
                    </p>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-12 px-6">
                <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-3">
                  <Bell className="h-7 w-7 text-gray-400" />
                </div>
                <p className="text-sm text-gray-500 font-medium">Nenhuma notificação</p>
                <p className="text-xs text-gray-400 mt-1">Você está em dia!</p>
              </div>
            )}
          </ScrollArea>

          {/* Footer */}
          {notifications.length > 0 && (
            <div className="px-2 py-2 border-t border-gray-100 bg-gray-50">
              <Button
                variant="ghost"
                size="sm"
                className="w-full text-sm text-gray-700 hover:text-[#46142b] hover:bg-gray-100 font-medium h-9"
                onClick={() => {
                  setShowAllNotifications(true)
                  setIsOpen(false)
                }}
              >
                Ver todas as notificações
              </Button>
            </div>
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Modal de todas as notificações */}
      <Dialog open={showAllNotifications} onOpenChange={setShowAllNotifications}>
        <DialogContent className="sm:max-w-[640px] max-h-[85vh] overflow-hidden flex flex-col">
          <DialogHeader className="border-b border-gray-100 pb-4">
            <div className="flex items-center justify-between">
              <DialogTitle className="text-xl font-semibold text-gray-900">Todas as Notificações</DialogTitle>
              {unreadCount > 0 && (
                <Badge variant="secondary" className="bg-[#511A2B]/10 text-[#511A2B] font-semibold">
                  {unreadCount} não {unreadCount === 1 ? "lida" : "lidas"}
                </Badge>
              )}
            </div>
            {unreadCount > 0 && (
              <div className="flex justify-end mt-3">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleMarkAllAsRead}
                  className="text-xs text-[#46142b] border-[#46142b]/30 hover:bg-[#46142b]/10 font-medium bg-transparent"
                >
                  Marcar todas como lidas
                </Button>
              </div>
            )}
          </DialogHeader>

          <ScrollArea className="flex-1 -mx-6 px-6 overflow-auto">
            {!loading && notifications.length > 0 ? (
              <div className="divide-y divide-gray-100">
                {notifications.map((notification) => (
                  <NotificationItem key={notification.id} notification={notification} />
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-16">
                <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center mb-4">
                  <Bell className="h-9 w-9 text-gray-400" />
                </div>
                <p className="text-base text-gray-600 font-medium">Nenhuma notificação</p>
                <p className="text-sm text-gray-400 mt-1">Você está em dia!</p>
              </div>
            )}
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </>
  )
}
