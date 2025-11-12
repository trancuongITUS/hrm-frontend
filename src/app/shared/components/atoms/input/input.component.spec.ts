import { ComponentFixture, TestBed } from '@angular/core/testing';
import { InputComponent } from './input.component';

describe('InputComponent', () => {
  let component: InputComponent;
  let fixture: ComponentFixture<InputComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InputComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(InputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have default type as text', () => {
    expect(component.type()).toBe('text');
  });

  it('should have default size as medium', () => {
    expect(component.size()).toBe('medium');
  });

  it('should emit valueChange event when value changes', () => {
    let emittedValue: string | number = '';
    component.valueChange.subscribe((value) => {
      emittedValue = value;
    });

    component.handleChange('test value');

    expect(emittedValue).toBe('test value');
  });

  it('should update internal value when handleChange is called', () => {
    component.handleChange('new value');
    expect(component.internalValue()).toBe('new value');
  });

  it('should apply has-error class when hasError is true', () => {
    fixture.componentRef.setInput('hasError', true);
    fixture.detectChanges();

    expect(component.inputClass()).toContain('has-error');
  });
});

