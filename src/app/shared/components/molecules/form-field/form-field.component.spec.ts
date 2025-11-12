import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormFieldComponent } from './form-field.component';

describe('FormFieldComponent', () => {
  let component: FormFieldComponent;
  let fixture: ComponentFixture<FormFieldComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormFieldComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(FormFieldComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have default size as medium', () => {
    expect(component.size()).toBe('medium');
  });

  it('should be full width by default', () => {
    expect(component.fullWidth()).toBe(true);
  });

  it('should not be required by default', () => {
    expect(component.required()).toBe(false);
  });

  it('should apply full width class when fullWidth is true', () => {
    const containerClass = component.containerClass();
    expect(containerClass).toContain('w-full');
  });
});

