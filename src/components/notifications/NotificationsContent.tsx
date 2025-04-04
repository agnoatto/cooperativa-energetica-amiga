
/**
 * Componente de Conteúdo das Notificações
 * 
 * Este componente exibe o conteúdo das notificações do sistema,
 * permitindo que o usuário visualize e marque como lidas.
 */
import React from 'react';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Info, AlertCircle, CheckCircle2, RefreshCw, Check, BellOff } from 'lucide-react';
import { useNotifications, Notification } from '@/contexts/NotificationsContext';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { ScrollArea } from '@/components/ui/scroll-area';

export const NotificationsContent: React.FC = () => {
  const { notifications, markAsRead, markAllAsRead } = useNotifications();

  if (notifications.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-6 text-center">
        <BellOff className="h-8 w-8 text-gray-400 mb-2" />
        <p className="text-sm text-gray-500">Não há notificações</p>
      </div>
    );
  }

  const getIconForType = (type: Notification['type']) => {
    switch (type) {
      case 'info':
        return <Info className="h-4 w-4 text-blue-500" />;
      case 'warning':
        return <AlertCircle className="h-4 w-4 text-amber-500" />;
      case 'success':
        return <CheckCircle2 className="h-4 w-4 text-green-500" />;
      case 'update':
        return <RefreshCw className="h-4 w-4 text-purple-500" />;
      default:
        return <Info className="h-4 w-4 text-blue-500" />;
    }
  };

  return (
    <>
      <div className="flex items-center justify-between px-4 py-2 border-b">
        <h3 className="font-medium">Notificações</h3>
        <Button
          variant="ghost"
          size="sm"
          onClick={markAllAsRead}
          className="text-xs hover:bg-gray-100"
        >
          <Check className="h-3 w-3 mr-1" />
          Marcar todas como lidas
        </Button>
      </div>
      <ScrollArea className="flex-1">
        <div className="divide-y">
          {notifications.map((notification) => (
            <div
              key={notification.id}
              className={cn(
                "p-4 transition-colors",
                !notification.isRead && "bg-blue-50"
              )}
            >
              <div className="flex gap-3">
                <div className="flex-shrink-0 mt-0.5">
                  {getIconForType(notification.type)}
                </div>
                <div className="flex-1 space-y-1">
                  <div className="flex items-start justify-between">
                    <p className="text-sm font-medium">{notification.title}</p>
                    <span className="text-xs text-gray-500">
                      {format(new Date(notification.date), 'dd/MM', { locale: ptBR })}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500">{notification.content}</p>
                  {notification.link && (
                    <Link 
                      to={notification.link} 
                      className="text-xs text-blue-600 hover:text-blue-800 inline-block mt-1"
                      onClick={() => markAsRead(notification.id)}
                    >
                      {notification.linkText || 'Ver mais'}
                    </Link>
                  )}
                  {!notification.isRead && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => markAsRead(notification.id)}
                      className="text-xs mt-1 hover:bg-gray-100 h-6 px-2"
                    >
                      Marcar como lida
                    </Button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
    </>
  );
};
