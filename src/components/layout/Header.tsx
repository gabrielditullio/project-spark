import { Bell, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useNotifications } from '@/hooks/useNotifications';

export default function Header() {
  const { unreadCount } = useNotifications();

  return (
    <header className="flex items-center justify-between h-14 px-6 border-b border-border bg-background">
      <div className="relative w-full max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Buscar contatos, deals, conversas..."
          className="pl-10 bg-muted/50 border-border focus:bg-background"
        />
      </div>

      <div className="flex items-center gap-2 ml-4">
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="w-5 h-5 text-muted-foreground" />
          {unreadCount > 0 && (
            <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-destructive text-destructive-foreground text-[10px] font-bold rounded-full flex items-center justify-center">
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          )}
        </Button>
      </div>
    </header>
  );
}
