import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface Notification {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message: string;
  duration?: number;
  timestamp: Date;
}

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private notificationsSubject = new BehaviorSubject<Notification[]>([]);
  public notifications$ = this.notificationsSubject.asObservable();

  private notificationId = 0;

  show(notification: Omit<Notification, 'id' | 'timestamp'>): void {
    const id = `notification-${++this.notificationId}`;
    const fullNotification: Notification = {
      ...notification,
      id,
      timestamp: new Date()
    };

    // Add to notifications array
    const currentNotifications = this.notificationsSubject.value;
    this.notificationsSubject.next([...currentNotifications, fullNotification]);

    // Auto-remove after duration (default 4 seconds for success, 6 for others)
    const duration = notification.duration || (notification.type === 'success' ? 4000 : 6000);
    setTimeout(() => {
      this.remove(id);
    }, duration);
  }

  remove(id: string): void {
    const currentNotifications = this.notificationsSubject.value;
    const filteredNotifications = currentNotifications.filter(n => n.id !== id);
    this.notificationsSubject.next(filteredNotifications);
  }

  clear(): void {
    this.notificationsSubject.next([]);
  }

  // Convenience methods
  success(title: string, message: string, duration?: number): void {
    this.show({ type: 'success', title, message, duration });
  }

  error(title: string, message: string, duration?: number): void {
    this.show({ type: 'error', title, message, duration });
  }

  warning(title: string, message: string, duration?: number): void {
    this.show({ type: 'warning', title, message, duration });
  }

  info(title: string, message: string, duration?: number): void {
    this.show({ type: 'info', title, message, duration });
  }
}
