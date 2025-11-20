import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DynamicFormComponent } from './dynamic-form.component';
import { Validators } from '@angular/forms';
import { FormFieldConfig } from '@shared/models';

describe('DynamicFormComponent', () => {
    let component: DynamicFormComponent;
    let fixture: ComponentFixture<DynamicFormComponent>;

    const mockFields: FormFieldConfig[] = [
        {
            name: 'email',
            label: 'Email',
            type: 'email',
            required: true,
            validators: [Validators.email]
        },
        {
            name: 'name',
            label: 'Name',
            type: 'text',
            required: true
        }
    ];

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [DynamicFormComponent]
        }).compileComponents();

        fixture = TestBed.createComponent(DynamicFormComponent);
        component = fixture.componentInstance;
        fixture.componentRef.setInput('fields', mockFields);
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should build form with fields', () => {
        expect(component.form).toBeDefined();
        expect(component.form.get('email')).toBeDefined();
        expect(component.form.get('name')).toBeDefined();
    });

    it('should have default columns of 1', () => {
        expect(component.columns()).toBe(1);
    });

    it('should validate required fields', () => {
        const emailControl = component.form.get('email');
        const nameControl = component.form.get('name');

        expect(emailControl?.valid).toBe(false);
        expect(nameControl?.valid).toBe(false);

        emailControl?.setValue('test@example.com');
        nameControl?.setValue('John Doe');

        expect(emailControl?.valid).toBe(true);
        expect(nameControl?.valid).toBe(true);
    });

    it('should emit formSubmit when form is valid', () => {
        let emittedValue: Record<string, unknown> = {};

        component.formSubmit.subscribe((value) => {
            emittedValue = value;
        });

        component.form.patchValue({
            email: 'test@example.com',
            name: 'John Doe'
        });

        component.handleSubmit();

        expect(emittedValue).toEqual({
            email: 'test@example.com',
            name: 'John Doe'
        });
    });

    it('should not emit formSubmit when form is invalid', () => {
        let emitted = false;

        component.formSubmit.subscribe(() => {
            emitted = true;
        });

        component.handleSubmit();

        expect(emitted).toBe(false);
    });

    it('should reset form', () => {
        component.form.patchValue({
            email: 'test@example.com',
            name: 'John Doe'
        });

        component.reset();

        expect(component.form.get('email')?.value).toBeNull();
        expect(component.form.get('name')?.value).toBeNull();
    });
});
