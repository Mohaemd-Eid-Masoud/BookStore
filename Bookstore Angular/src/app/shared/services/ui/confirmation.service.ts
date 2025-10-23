import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface ConfirmationOptions {
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  type?: 'danger' | 'warning' | 'info';
}

export interface ConfirmationResult {
  confirmed: boolean;
  data?: any;
}

@Injectable({
  providedIn: 'root'
})
export class ConfirmationService {
  private confirmationSubject = new BehaviorSubject<{
    isOpen: boolean;
    options: ConfirmationOptions;
    resolve: (result: ConfirmationResult) => void;
  } | null>(null);

  public confirmation$ = this.confirmationSubject.asObservable();

  constructor() {}

  confirm(options: ConfirmationOptions): Promise<ConfirmationResult> {
    return new Promise((resolve) => {
      this.confirmationSubject.next({
        isOpen: true,
        options,
        resolve
      });
    });
  }

  confirmDelete(itemName?: string): Promise<ConfirmationResult> {
    return this.confirm({
      title: 'Confirm Deletion',
      message: itemName
        ? `Are you sure you want to delete "${itemName}"? This action cannot be undone.`
        : 'Are you sure you want to delete this item? This action cannot be undone.',
      confirmText: 'Delete',
      cancelText: 'Cancel',
      type: 'danger'
    });
  }

  confirmCustomAction(title: string, message: string, confirmText: string = 'Confirm'): Promise<ConfirmationResult> {
    return this.confirm({
      title,
      message,
      confirmText,
      cancelText: 'Cancel',
      type: 'warning'
    });
  }

  confirmYesNo(title: string, message: string): Promise<ConfirmationResult> {
    return this.confirm({
      title,
      message,
      confirmText: 'Yes',
      cancelText: 'No',
      type: 'info'
    });
  }

  close(result: ConfirmationResult): void {
    const current = this.confirmationSubject.value;
    if (current) {
      current.resolve(result);
      this.confirmationSubject.next(null);
    }
  }

  cancel(): void {
    this.close({ confirmed: false });
  }

  confirmAction(): void {
    this.close({ confirmed: true });
  }
}
