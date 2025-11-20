import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AlertComponent } from './alert.component';

describe('AlertComponent', () => {
    let component: AlertComponent;
    let fixture: ComponentFixture<AlertComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [AlertComponent]
        }).compileComponents();

        fixture = TestBed.createComponent(AlertComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should have default status as info', () => {
        expect(component.status()).toBe('info');
    });

    it('should be visible by default', () => {
        expect(component.visible()).toBe(true);
    });

    it('should not be dismissible by default', () => {
        expect(component.dismissible()).toBe(false);
    });

    it('should map status to severity correctly', () => {
        fixture.componentRef.setInput('status', 'success');
        fixture.detectChanges();
        expect(component.severity()).toBe('success');

        fixture.componentRef.setInput('status', 'warning');
        fixture.detectChanges();
        expect(component.severity()).toBe('warn');
    });

    it('should use default icon based on status', () => {
        fixture.componentRef.setInput('status', 'error');
        fixture.detectChanges();
        expect(component.computedIcon()).toBe('pi pi-times-circle');
    });

    it('should use custom icon if provided', () => {
        fixture.componentRef.setInput('icon', 'pi pi-custom');
        fixture.detectChanges();
        expect(component.computedIcon()).toBe('pi pi-custom');
    });

    it('should emit dismissed event when handleDismiss is called', () => {
        let dismissed = false;
        component.dismissed.subscribe(() => {
            dismissed = true;
        });

        component.handleDismiss();
        expect(dismissed).toBe(true);
    });
});
