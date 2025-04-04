
/**
 * Cabeçalho da Aplicação
 * 
 * Este componente renderiza o cabeçalho principal da aplicação,
 * incluindo o botão de notificações e outras ações do sistema.
 */
import React from 'react';
import { NotificationBell } from '@/components/notifications/NotificationBell';

export function AppHeader() {
  return (
    <header className="fixed top-0 right-0 z-40 h-16 pr-6 flex items-center justify-end">
      <NotificationBell />
    </header>
  );
}
