import { createContext, useContext, useState, useCallback } from 'react';
import { NOTIFICATIONS_DATA } from '../store/mockData';

const NotificationContext = createContext(null);

export function NotificationProvider({ children }) {
  const [notifications, setNotifications] = useState(NOTIFICATIONS_DATA);
  const [panelOpen, setPanelOpen] = useState(false);

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAllRead = useCallback(() => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  }, []);

  const markRead = useCallback((id) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  }, []);

  const addNotification = useCallback((notif) => {
    setNotifications(prev => [{ ...notif, id: `n${Date.now()}`, read: false, time: 'Just now' }, ...prev]);
  }, []);

  return (
    <NotificationContext.Provider value={{ notifications, unreadCount, panelOpen, setPanelOpen, markAllRead, markRead, addNotification }}>
      {children}
    </NotificationContext.Provider>
  );
}

export const useNotifications = () => useContext(NotificationContext);
