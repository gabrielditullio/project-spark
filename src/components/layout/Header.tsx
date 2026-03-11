import { useState, useRef, useEffect } from 'react';
import { Bell, Search, CheckCheck } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useNotifications } from '@/hooks/useNotifications';

export default function Header() {
  const { notifications, unreadCount, isLoading, markAsRead, markAllAsRead } = useNotifications();
  const [showNotifications, setShowNotifications] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Fechar ao clicar fora
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
    }
    if (showNotifications) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [showNotifications]);

  const formatTimeAgo = (dateStr: string) => {
    const diff = Date.now() - new Date(dateStr).getTime();
    const minutes = Math.floor(diff / 60000);
    if (minutes < 1) return 'Agora';
    if (minutes < 60) return `${minutes}min`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h`;
    const days = Math.floor(hours / 24);
    return `${days}d`;
  };

  return (
    <div className="flex items-center justify-between w-full">
      <div className="relative w-full max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Buscar contatos, deals, conversas..."
          className="pl-10 bg-muted/50 border-border focus:bg-card"
        />
      </div>

      <div className="flex items-center gap-2 ml-4" ref={dropdownRef}>
        <div className="relative">
          <Button
            variant="ghost"
            size="icon"
            className="relative"
            onClick={() => setShowNotifications(!showNotifications)}
          >
            <Bell className="w-5 h-5 text-muted-foreground" />
            {unreadCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-destructive text-destructive-foreground text-[10px] font-bold rounded-full flex items-center justify-center">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </Button>

          {showNotifications && (
            <div className="absolute right-0 top-full mt-2 w-80 bg-card rounded-lg shadow-lg border border-border z-50 overflow-hidden">
              <div className="flex items-center justify-between px-4 py-3 border-b border-border">
                <h3 className="text-sm font-semibold text-foreground">Notificações</h3>
                {unreadCount > 0 && (
                  <button
                    onClick={() => markAllAsRead.mutate()}
                    className="text-xs text-primary hover:text-primary/80 flex items-center gap-1"
                  >
                    <CheckCheck className="w-3 h-3" />
                    Marcar todas como lidas
                  </button>
                )}
              </div>
              <div className="max-h-80 overflow-y-auto">
                {isLoading ? (
                  <div className="p-4 space-y-3">
                    {Array.from({ length: 3 }).map((_, i) => (
                      <div key={i} className="h-12 bg-muted rounded animate-pulse" />
                    ))}
                  </div>
                ) : notifications.length === 0 ? (
                  <div className="p-8 text-center text-muted-foreground">
                    <Bell className="w-8 h-8 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">Nenhuma notificação.</p>
                  </div>
                ) : (
                  notifications.slice(0, 20).map((notification) => (
                    <button
                      key={notification.id}
                      onClick={() => {
                        if (!notification.read_at) markAsRead.mutate(notification.id);
                      }}
                      className={`w-full text-left px-4 py-3 hover:bg-muted/50 transition-colors border-b border-border last:border-0 ${!notification.read_at ? 'bg-primary/5' : ''}`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <p className={`text-sm truncate ${!notification.read_at ? 'font-semibold text-foreground' : 'text-muted-foreground'}`}>
                            {notification.title}
                          </p>
                          {notification.body && (
                            <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">{notification.body}</p>
                          )}
                        </div>
                        <div className="flex items-center gap-1 flex-shrink-0">
                          <span className="text-[10px] text-muted-foreground">{formatTimeAgo(notification.created_at)}</span>
                          {!notification.read_at && <div className="w-2 h-2 rounded-full bg-primary" />}
                        </div>
                      </div>
                    </button>
                  ))
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
