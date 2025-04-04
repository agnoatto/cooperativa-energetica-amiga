
/**
 * Contexto de Notificações do Sistema
 * 
 * Este contexto gerencia as notificações do sistema, incluindo atualizações,
 * novidades e mensagens importantes para os usuários. Permite que o usuário
 * visualize e marque notificações como lidas, mantendo um histórico das atualizações.
 */
import React, { createContext, useState, useContext, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './AuthContext';

export interface Notification {
  id: string;
  title: string;
  content: string;
  date: string;
  isRead: boolean;
  type: 'update' | 'info' | 'warning' | 'success';
  link?: string;
  linkText?: string;
}

interface NotificationsContextType {
  notifications: Notification[];
  unreadCount: number;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  addNotification: (notification: Omit<Notification, 'id' | 'date' | 'isRead'>) => void;
  clearAllNotifications: () => void;
}

const NotificationsContext = createContext<NotificationsContextType | undefined>(undefined);

// Notificações do sistema (simuladas - em produção viriam do banco de dados)
const SYSTEM_NOTIFICATIONS: Omit<Notification, 'id' | 'date' | 'isRead'>[] = [
  {
    title: 'Novo Fluxo de Faturas',
    content: 'O sistema agora gerencia o ciclo de vida das faturas de forma mais integrada. Faturas são criadas no módulo Faturas e após enviadas, são gerenciadas pelo módulo Financeiro.',
    type: 'info',
    link: '/financeiro/contas-receber',
    linkText: 'Ver Contas a Receber'
  },
  {
    title: 'Módulo Financeiro Atualizado',
    content: 'Agora todas as faturas geram automaticamente lançamentos financeiros desde o momento de sua criação, proporcionando melhor controle financeiro.',
    type: 'update',
  },
  {
    title: 'Nova visualização de Usinas',
    content: 'Adicionamos painéis de controle que facilitam o acompanhamento da produção de energia das usinas.',
    type: 'success',
  }
];

export const NotificationsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const { profile } = useAuth();
  const userId = profile?.id;

  // Carregar notificações do localStorage ou do sistema
  useEffect(() => {
    if (!userId) return;

    const loadNotifications = async () => {
      // Primeiro verifica se temos notificações salvas para este usuário
      const storedNotifications = localStorage.getItem(`notifications_${userId}`);
      
      if (storedNotifications) {
        setNotifications(JSON.parse(storedNotifications));
      } else {
        // Se não tiver notificações salvas, carrega as notificações do sistema
        const systemNotifications = SYSTEM_NOTIFICATIONS.map(notification => ({
          ...notification,
          id: crypto.randomUUID(),
          date: new Date().toISOString(),
          isRead: false,
        }));
        
        setNotifications(systemNotifications);
        localStorage.setItem(`notifications_${userId}`, JSON.stringify(systemNotifications));
      }
    };

    loadNotifications();
  }, [userId]);

  // Salvar notificações no localStorage sempre que mudarem
  useEffect(() => {
    if (userId && notifications.length > 0) {
      localStorage.setItem(`notifications_${userId}`, JSON.stringify(notifications));
    }
  }, [notifications, userId]);

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const markAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === id 
          ? { ...notification, isRead: true } 
          : notification
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notification => ({ ...notification, isRead: true }))
    );
  };

  const addNotification = (notification: Omit<Notification, 'id' | 'date' | 'isRead'>) => {
    const newNotification: Notification = {
      ...notification,
      id: crypto.randomUUID(),
      date: new Date().toISOString(),
      isRead: false,
    };
    
    setNotifications(prev => [newNotification, ...prev]);
  };

  const clearAllNotifications = () => {
    setNotifications([]);
  };

  return (
    <NotificationsContext.Provider
      value={{
        notifications,
        unreadCount,
        markAsRead,
        markAllAsRead,
        addNotification,
        clearAllNotifications,
      }}
    >
      {children}
    </NotificationsContext.Provider>
  );
};

export const useNotifications = () => {
  const context = useContext(NotificationsContext);
  if (context === undefined) {
    throw new Error('useNotifications must be used within a NotificationsProvider');
  }
  return context;
};
