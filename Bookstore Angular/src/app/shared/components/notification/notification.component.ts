import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { NotificationService, Notification } from '../../services/notification/notification.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-notification',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.css'],
  animations: [
    trigger('slideInOut', [
      state('in', style({
        transform: 'translateX(0)',
        opacity: 1
      })),
      transition('void => *', [
        style({
          transform: 'translateX(100%)',
          opacity: 0
        }),
        animate('300ms ease-in')
      ]),
      transition('* => void', [
        animate('300ms ease-out', style({
          transform: 'translateX(100%)',
          opacity: 0
        }))
      ])
    ])
  ]
})
export class NotificationComponent implements OnInit, OnDestroy {
  notifications: Notification[] = [];
  private subscription?: Subscription;

  constructor(private notificationService: NotificationService) {}

  ngOnInit(): void {
    this.subscription = this.notificationService.notifications$.subscribe(
      notifications => {
        this.notifications = notifications;
      }
    );
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }

  removeNotification(id: string): void {
    this.notificationService.remove(id);
  }

  getIconClass(type: string): string {
    switch (type) {
      case 'success': return 'fa-check-circle';
      case 'error': return 'fa-exclamation-circle';
      case 'warning': return 'fa-exclamation-triangle';
      case 'info': return 'fa-info-circle';
      default: return 'fa-info-circle';
    }
  }
}
