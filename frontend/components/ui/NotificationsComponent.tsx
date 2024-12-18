import React, { useState, useEffect } from 'react';
import { Bell } from 'lucide-react';
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/Alert"

interface Notification {
  id: number;
  type: 'rappel_emprunt' | 'nouvelle_reservation' | 'date_echeance';
  message: string;
  creation_date: string;
  viewed: boolean;
}

const NotificationComponent = ({ userId }: { userId: number }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [showNotifications, setShowNotifications] = useState(false);

  useEffect(() => {

    const fetchExistingNotifications = async () => {
      try {
        const response = await fetch(`http://localhost:5000/notifications/${userId}`);
        if (!response.ok) throw new Error('Failed to fetch notifications');
        const data = await response.json();
        setNotifications(data);
      } catch (error) {
        console.error('Error fetching notifications:', error);
      }
    };

    fetchExistingNotifications();


    const eventSource = new EventSource(`http://localhost:5000/notifications/stream/${userId}`);

    eventSource.addEventListener('notification', (event) => {
      const newNotifications = JSON.parse(event.data);
      setNotifications(current => [...newNotifications, ...current]);
    });

    eventSource.onerror = (error) => {
      console.error('SSE Error:', error);
      eventSource.close();
    };

    return () => {
      eventSource.close();
    };
  }, [userId]);

  const markAsRead = async (notificationId: number) => {
    try {
      await fetch(`http://localhost:5000/notifications/${notificationId}/mark-read`, {
        method: 'POST'
      });
      setNotifications(current =>
        current.filter(n => n.id !== notificationId)
      );
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  return (
    <div className="relative">
      <button
        onClick={() => setShowNotifications(!showNotifications)}
        className="p-2 rounded-full hover:bg-zinc-700 transition-colors relative"
      >
        <Bell className="h-6 w-6 text-zinc-100" />
        {notifications.length > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
            {notifications.length}
          </span>
        )}
      </button>

      {showNotifications && (
        <div className="absolute right-0 mt-2 w-96 max-h-96 overflow-y-auto bg-zinc-800 rounded-lg shadow-lg z-50">
          {notifications.length === 0 ? (
            <div className="p-4 text-zinc-400 text-center">
              Aucune notification
            </div>
          ) : (
            <div className="p-2 space-y-2">
              {notifications.map((notification) => (
                <Alert
                  key={notification.id}
                  className="bg-zinc-700 border-zinc-600 text-zinc-100"
                >
                  <AlertTitle className="text-sm font-medium">
                    {notification.type === 'date_echeance' && 'Retour Proche'}
                    {notification.type === 'rappel_emprunt' && 'Rappel Emprunt'}
                    {notification.type === 'nouvelle_reservation' && 'Nouvelle Réservation'}
                  </AlertTitle>
                  <AlertDescription className="text-sm text-zinc-300">
                    {notification.message}
                  </AlertDescription>
                  <button
                    onClick={() => markAsRead(notification.id)}
                    className="mt-2 text-xs text-zinc-400 hover:text-zinc-200"
                  >
                    Marquer comme lu
                  </button>
                </Alert>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default NotificationComponent;