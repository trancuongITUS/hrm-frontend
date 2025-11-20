import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BadgeComponent } from './badge.component';

describe('BadgeComponent', () => {
    let component: BadgeComponent;
    let fixture: ComponentFixture<BadgeComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [BadgeComponent]
        }).compileComponents();

        fixture = TestBed.createComponent(BadgeComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should have default variant as default', () => {
        expect(component.variant()).toBe('default');
    });

    it('should have default size as medium', () => {
        expect(component.size()).toBe('medium');
    });

    it('should not be a dot by default', () => {
        expect(component.dot()).toBe(false);
    });

    it('should apply correct size class for small badge', () => {
        fixture.componentRef.setInput('size', 'small');
        fixture.detectChanges();

        const badgeClass = component.badgeClass();
        expect(badgeClass).toContain('text-xs');
    });

    it('should apply rounded-full class when rounded is true', () => {
        fixture.componentRef.setInput('rounded', true);
        fixture.detectChanges();

        const badgeClass = component.badgeClass();
        expect(badgeClass).toContain('rounded-full');
    });

    it('should apply correct variant colors', () => {
        fixture.componentRef.setInput('variant', 'success');
        fixture.detectChanges();

        const badgeClass = component.badgeClass();
        expect(badgeClass).toContain('bg-green');
    });
});
