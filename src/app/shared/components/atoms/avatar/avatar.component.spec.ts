import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AvatarComponent } from './avatar.component';

describe('AvatarComponent', () => {
    let component: AvatarComponent;
    let fixture: ComponentFixture<AvatarComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [AvatarComponent]
        }).compileComponents();

        fixture = TestBed.createComponent(AvatarComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should have default size as medium', () => {
        expect(component.size()).toBe('medium');
    });

    it('should have default shape as circle', () => {
        expect(component.shape()).toBe('circle');
    });

    it('should not show status by default', () => {
        expect(component.showStatus()).toBe(false);
    });

    it('should map size correctly to PrimeNG size', () => {
        fixture.componentRef.setInput('size', 'small');
        fixture.detectChanges();
        expect(component.primeSize()).toBe('normal');

        fixture.componentRef.setInput('size', 'medium');
        fixture.detectChanges();
        expect(component.primeSize()).toBe('large');

        fixture.componentRef.setInput('size', 'large');
        fixture.detectChanges();
        expect(component.primeSize()).toBe('xlarge');
    });

    it('should apply correct status color classes', () => {
        fixture.componentRef.setInput('showStatus', true);
        fixture.componentRef.setInput('status', 'online');
        fixture.detectChanges();

        const statusClass = component.statusClass();
        expect(statusClass).toContain('bg-green-500');
    });
});
