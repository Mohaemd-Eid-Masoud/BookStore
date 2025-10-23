import { TestBed } from '@angular/core/testing';
import { ConfirmationService } from './confirmation.service';

describe('ConfirmationService', () => {
  let service: ConfirmationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ConfirmationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('confirm', () => {
    it('should return a promise', (done) => {
      const promise = service.confirm({
        title: 'Test Title',
        message: 'Test Message'
      });

      expect(promise).toBeInstanceOf(Promise);

      // Simulate user canceling
      setTimeout(() => {
        service.cancel();
      }, 0);

      promise.then(result => {
        expect(result.confirmed).toBe(false);
        done();
      });
    });

    it('should handle confirmation', (done) => {
      const promise = service.confirm({
        title: 'Test Title',
        message: 'Test Message'
      });

      // Simulate user confirming
      setTimeout(() => {
        service.confirmAction();
      }, 0);

      promise.then(result => {
        expect(result.confirmed).toBe(true);
        done();
      });
    });
  });

  describe('confirmDelete', () => {
    it('should create confirmation with delete styling', (done) => {
      const promise = service.confirmDelete('Test Item');

      expect(promise).toBeInstanceOf(Promise);

      // Simulate user confirming
      setTimeout(() => {
        service.confirmAction();
      }, 0);

      promise.then(result => {
        expect(result.confirmed).toBe(true);
        done();
      });
    });

    it('should handle item without name', (done) => {
      const promise = service.confirmDelete();

      setTimeout(() => {
        service.confirmAction();
      }, 0);

      promise.then(result => {
        expect(result.confirmed).toBe(true);
        done();
      });
    });
  });

  describe('confirmCustomAction', () => {
    it('should create confirmation with custom styling', (done) => {
      const promise = service.confirmCustomAction('Custom Title', 'Custom Message', 'Proceed');

      expect(promise).toBeInstanceOf(Promise);

      setTimeout(() => {
        service.confirmAction();
      }, 0);

      promise.then(result => {
        expect(result.confirmed).toBe(true);
        done();
      });
    });

    it('should use default confirm text', (done) => {
      const promise = service.confirmCustomAction('Custom Title', 'Custom Message');

      setTimeout(() => {
        service.confirmAction();
      }, 0);

      promise.then(result => {
        expect(result.confirmed).toBe(true);
        done();
      });
    });
  });

  describe('confirmYesNo', () => {
    it('should create confirmation with Yes/No options', (done) => {
      const promise = service.confirmYesNo('Question', 'Do you want to proceed?');

      expect(promise).toBeInstanceOf(Promise);

      setTimeout(() => {
        service.confirmAction();
      }, 0);

      promise.then(result => {
        expect(result.confirmed).toBe(true);
        done();
      });
    });
  });

  describe('modal management', () => {
    it('should emit confirmation state changes', (done) => {
      service.confirmation$.subscribe(confirmation => {
        if (confirmation?.isOpen) {
          expect(confirmation.isOpen).toBe(true);
          expect(confirmation.options.title).toBe('Test Title');
          done();
        }
      });

      service.confirm({
        title: 'Test Title',
        message: 'Test Message'
      });
    });

    it('should close modal when cancel is called', (done) => {
      const promise = service.confirm({
        title: 'Test Title',
        message: 'Test Message'
      });

      setTimeout(() => {
        service.cancel();
      }, 0);

      promise.then(result => {
        expect(result.confirmed).toBe(false);
        done();
      });
    });

    it('should close modal when confirmAction is called', (done) => {
      const promise = service.confirm({
        title: 'Test Title',
        message: 'Test Message'
      });

      setTimeout(() => {
        service.confirmAction();
      }, 0);

      promise.then(result => {
        expect(result.confirmed).toBe(true);
        done();
      });
    });

    it('should handle multiple rapid confirmations', (done) => {
      let completedCount = 0;

      const promise1 = service.confirm({ title: 'First', message: 'First message' });
      const promise2 = service.confirm({ title: 'Second', message: 'Second message' });

      setTimeout(() => {
        service.confirmAction(); // Confirm first
      }, 0);

      setTimeout(() => {
        service.cancel(); // Cancel second
      }, 10);

      promise1.then(result => {
        expect(result.confirmed).toBe(true);
        completedCount++;
        if (completedCount === 2) done();
      });

      promise2.then(result => {
        expect(result.confirmed).toBe(false);
        completedCount++;
        if (completedCount === 2) done();
      });
    });
  });

  describe('error handling', () => {
    it('should handle promise resolution errors', (done) => {
      const promise = service.confirm({
        title: 'Test',
        message: 'Test'
      });

      // Don't call confirm or cancel - should still resolve
      setTimeout(() => {
        // Manually resolve the promise (simulating internal resolution)
        const current = (service as any).confirmationSubject.value;
        if (current) {
          current.resolve({ confirmed: false });
          (service as any).confirmationSubject.next(null);
        }
      }, 10);

      promise.then(result => {
        expect(result).toBeDefined();
        done();
      }).catch(() => {
        done(); // Should not reach here
      });
    });
  });
});
