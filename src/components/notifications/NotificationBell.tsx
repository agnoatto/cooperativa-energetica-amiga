
/**
 * Componente de Sino de Notificações
 * 
 * Este componente exibe um ícone de sino no canto superior direito da interface,
 * indicando quando há notificações não lidas. Ao clicar, exibe um popover com
 * a lista de notificações do sistema.
 */
import React from 'react';
import { Bell, BellOff } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { useNotifications } from '@/contexts/NotificationsContext';
import { NotificationsContent } from './NotificationsContent';

export const NotificationBell: React.FC = () => {
  const { unreadCount } = useNotifications();

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button 
          variant="ghost" 
          size="icon" 
          className="relative"
          aria-label="Notificações"
        >
          {unreadCount > 0 ? <Bell className="h-5 w-5" /> : <BellOff className="h-5 w-5 text-gray-400" />}
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-medium text-white">
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent 
        align="end" 
        className="w-80 p-0 max-h-[500px] overflow-hidden flex flex-col"
      >
        <NotificationsContent />
      </PopoverContent>
    </Popover>
  );
};
