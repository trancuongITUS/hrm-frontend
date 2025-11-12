import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ModalComponent } from './modal.component';

describe('ModalComponent', () => {
  let component: ModalComponent;
  let fixture: ComponentFixture<ModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModalComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(ModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should not be visible by default', () => {
    expect(component.visible()).toBe(false);
  });

  it('should have default size as md', () => {
    expect(component.size()).toBe('md');
  });

  it('should show footer by default', () => {
    expect(component.showFooter()).toBe(true);
  });

  it('should show confirm and cancel buttons by default', () => {
    expect(component.showConfirmButton()).toBe(true);
    expect(component.showCancelButton()).toBe(true);
  });

  it('should emit confirm event', () => {
    let confirmed = false;
    component.confirm.subscribe(() => {
      confirmed = true;
    });

    component.handleConfirm();
    expect(confirmed).toBe(true);
  });

  it('should emit cancel event and hide modal', () => {
    component.visible.set(true);
    
    let cancelled = false;
    component.cancel.subscribe(() => {
      cancelled = true;
    });

    component.handleCancel();
    expect(cancelled).toBe(true);
    expect(component.visible()).toBe(false);
  });

  it('should return correct dialog class for size', () => {
    fixture.componentRef.setInput('size', 'lg');
    fixture.detectChanges();
    
    const dialogClass = component.dialogClass();
    expect(dialogClass).toContain('md:w-[48rem]');
  });
});

