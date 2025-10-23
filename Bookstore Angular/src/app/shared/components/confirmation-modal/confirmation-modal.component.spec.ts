import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ConfirmationModalComponent } from './confirmation-modal.component';
import { ConfirmationService } from '../../services/ui/confirmation.service';

describe('ConfirmationModalComponent', () => {
  let component: ConfirmationModalComponent;
  let fixture: ComponentFixture<ConfirmationModalComponent>;
  let mockConfirmationService: jasmine.SpyObj<ConfirmationService>;

  beforeEach(async () => {
    const confirmationServiceSpy = jasmine.createSpyObj('ConfirmationService', [
      'confirmation$', 'confirmAction', 'cancel'
    ]);

    await TestBed.configureTestingModule({
      imports: [ConfirmationModalComponent],
      providers: [
        { provide: ConfirmationService, useValue: confirmationServiceSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ConfirmationModalComponent);
    component = fixture.componentInstance;
    mockConfirmationService = TestBed.inject(ConfirmationService) as jasmine.SpyObj<ConfirmationService>;

    // Mock the confirmation$ observable
    mockConfirmationService.confirmation$ = {
      subscribe: jasmine.createSpy('subscribe').and.returnValue({
        unsubscribe: jasmine.createSpy('unsubscribe')
      })
    } as any;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with closed modal', () => {
    expect(component.isOpen).toBe(false);
  });

  it('should subscribe to confirmation service on init', () => {
    component.ngOnInit();

    expect(mockConfirmationService.confirmation$.subscribe).toHaveBeenCalled();
  });

  it('should unsubscribe on destroy', () => {
    const unsubscribeSpy = jasmine.createSpy('unsubscribe');
    (component as any).subscription = { unsubscribe: unsubscribeSpy };

    component.ngOnDestroy();

    expect(unsubscribeSpy).toHaveBeenCalled();
  });

  it('should handle confirm action', () => {
    component.onConfirm();

    expect(mockConfirmationService.confirmAction).toHaveBeenCalled();
  });

  it('should handle cancel action', () => {
    component.onCancel();

    expect(mockConfirmationService.cancel).toHaveBeenCalled();
  });

  it('should return correct modal class', () => {
    component.options = { title: 'Test', message: 'Test', type: 'danger' };
    expect(component.modalClass).toBe('danger');

    component.options = { title: 'Test', message: 'Test' };
    expect(component.modalClass).toBe('info');
  });

  it('should return correct button class', () => {
    component.options = { title: 'Test', message: 'Test', type: 'warning' };
    expect(component.buttonClass).toBe('warning');

    component.options = { title: 'Test', message: 'Test' };
    expect(component.buttonClass).toBe('info');
  });
});
