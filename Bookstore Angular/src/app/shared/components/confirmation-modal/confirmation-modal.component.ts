  import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConfirmationService, ConfirmationOptions } from '../../services/ui/confirmation.service';
import { Subscription } from 'rxjs';

interface ConfirmationState {
  isOpen: boolean;
  options: ConfirmationOptions;
  resolve: (result: { confirmed: boolean; data?: any }) => void;
}

@Component({
  selector: 'app-confirmation-modal',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="modal-overlay" *ngIf="isOpen" (click)="onCancel()">
      <div class="modal-content" (click)="$event.stopPropagation()">
        <div class="modal-header">
          <h3 [class]="modalClass">{{ options.title }}</h3>
          <button class="close-btn" (click)="onCancel()" title="Close">
            <i class="fas fa-times"></i>
          </button>
        </div>

        <div class="modal-body">
          <p>{{ options.message }}</p>
        </div>

        <div class="modal-footer">
          <button
            class="btn btn-secondary"
            (click)="onCancel()"
            type="button">
            {{ options.cancelText || 'Cancel' }}
          </button>
          <button
            class="btn"
            [class]="buttonClass"
            (click)="onConfirm()"
            type="button">
            {{ options.confirmText || 'Confirm' }}
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .modal-overlay {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.6);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1000;
      backdrop-filter: blur(2px);
    }

    .modal-content {
      background: white;
      border-radius: 12px;
      box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
      max-width: 500px;
      width: 90%;
      max-height: 90vh;
      overflow-y: auto;
      animation: modalSlideIn 0.3s ease-out;
    }

    @keyframes modalSlideIn {
      from {
        opacity: 0;
        transform: translateY(-50px) scale(0.9);
      }
      to {
        opacity: 1;
        transform: translateY(0) scale(1);
      }
    }

    .modal-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 20px 24px;
      border-bottom: 1px solid #e5e7eb;
    }

    .modal-header h3 {
      margin: 0;
      font-size: 1.25rem;
      font-weight: 600;
    }

    .modal-header h3.danger {
      color: #dc2626;
    }

    .modal-header h3.warning {
      color: #d97706;
    }

    .modal-header h3.info {
      color: #2563eb;
    }

    .close-btn {
      background: none;
      border: none;
      padding: 8px;
      border-radius: 6px;
      cursor: pointer;
      color: #6b7280;
      transition: all 0.2s;
    }

    .close-btn:hover {
      background: #f3f4f6;
      color: #374151;
    }

    .modal-body {
      padding: 20px 24px;
    }

    .modal-body p {
      margin: 0;
      font-size: 1rem;
      line-height: 1.5;
      color: #374151;
    }

    .modal-footer {
      display: flex;
      gap: 12px;
      justify-content: flex-end;
      padding: 16px 24px;
      border-top: 1px solid #e5e7eb;
    }

    .btn {
      padding: 10px 20px;
      border-radius: 8px;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.2s;
      border: none;
      min-width: 80px;
    }

    .btn-secondary {
      background: #f3f4f6;
      color: #374151;
    }

    .btn-secondary:hover {
      background: #e5e7eb;
    }

    .btn.danger {
      background: #dc2626;
      color: white;
    }

    .btn.danger:hover {
      background: #b91c1c;
    }

    .btn.warning {
      background: #d97706;
      color: white;
    }

    .btn.warning:hover {
      background: #b45309;
    }

    .btn.info {
      background: #2563eb;
      color: white;
    }

    .btn.info:hover {
      background: #1d4ed8;
    }
  `]
})
export class ConfirmationModalComponent implements OnInit, OnDestroy {
  isOpen = false;
  options: ConfirmationOptions = { title: '', message: '' };
  private subscription?: Subscription;

  constructor(private confirmationService: ConfirmationService) {}

  ngOnInit(): void {
    this.subscription = this.confirmationService.confirmation$.subscribe((confirmation: ConfirmationState | null) => {
      if (confirmation) {
        this.isOpen = confirmation.isOpen;
        this.options = confirmation.options;
      } else {
        this.isOpen = false;
      }
    });
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }

  get modalClass(): string {
    return this.options.type || 'info';
  }

  get buttonClass(): string {
    return this.options.type || 'info';
  }

  onConfirm(): void {
    this.confirmationService.confirmAction();
  }

  onCancel(): void {
    this.confirmationService.cancel();
  }
}
