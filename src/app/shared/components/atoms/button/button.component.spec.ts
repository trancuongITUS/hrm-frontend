import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ButtonComponent } from './button.component';

describe('ButtonComponent', () => {
  let component: ButtonComponent;
  let fixture: ComponentFixture<ButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ButtonComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(ButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have default variant as primary', () => {
    expect(component.variant()).toBe('primary');
  });

  it('should have default size as medium', () => {
    expect(component.size()).toBe('medium');
  });

  it('should emit onClick event when clicked and not disabled', () => {
    let emitted = false;
    component.onClick.subscribe(() => {
      emitted = true;
    });

    const event = new Event('click');
    component.handleClick(event);

    expect(emitted).toBe(true);
  });

  it('should not emit onClick event when disabled', () => {
    fixture.componentRef.setInput('disabled', true);
    fixture.detectChanges();

    let emitted = false;
    component.onClick.subscribe(() => {
      emitted = true;
    });

    const event = new Event('click');
    component.handleClick(event);

    expect(emitted).toBe(false);
  });

  it('should not emit onClick event when loading', () => {
    fixture.componentRef.setInput('loading', true);
    fixture.detectChanges();

    let emitted = false;
    component.onClick.subscribe(() => {
      emitted = true;
    });

    const event = new Event('click');
    component.handleClick(event);

    expect(emitted).toBe(false);
  });
});

