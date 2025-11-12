import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SpinnerComponent } from './spinner.component';

describe('SpinnerComponent', () => {
  let component: SpinnerComponent;
  let fixture: ComponentFixture<SpinnerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SpinnerComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(SpinnerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have default size as medium', () => {
    expect(component.size()).toBe('medium');
  });

  it('should not be inline by default', () => {
    expect(component.inline()).toBe(false);
  });

  it('should apply correct size style', () => {
    fixture.componentRef.setInput('size', 'small');
    fixture.detectChanges();

    const style = component.spinnerStyle();
    expect(style.width).toBe('24px');
    expect(style.height).toBe('24px');
  });

  it('should apply inline classes when inline is true', () => {
    fixture.componentRef.setInput('inline', true);
    fixture.detectChanges();

    const containerClass = component.containerClass();
    expect(containerClass).toContain('inline-flex');
  });
});

