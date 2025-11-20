import { ComponentFixture, TestBed } from '@angular/core/testing';
import { IconComponent } from './icon.component';

describe('IconComponent', () => {
    let component: IconComponent;
    let fixture: ComponentFixture<IconComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [IconComponent]
        }).compileComponents();

        fixture = TestBed.createComponent(IconComponent);
        fixture.componentRef.setInput('name', 'user');
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should have default size as medium', () => {
        expect(component.size()).toBe('medium');
    });

    it('should add pi prefix to icon name if not present', () => {
        fixture.componentRef.setInput('name', 'user');
        fixture.detectChanges();

        const iconClass = component.iconClass();
        expect(iconClass).toContain('pi-user');
    });

    it('should not duplicate pi prefix if already present', () => {
        fixture.componentRef.setInput('name', 'pi-check');
        fixture.detectChanges();

        const iconClass = component.iconClass();
        expect(iconClass).toContain('pi-check');
        expect(iconClass).not.toContain('pi-pi-check');
    });

    it('should apply spin class when spin is true', () => {
        fixture.componentRef.setInput('spin', true);
        fixture.detectChanges();

        const iconClass = component.iconClass();
        expect(iconClass).toContain('pi-spin');
    });

    it('should apply custom color class', () => {
        fixture.componentRef.setInput('color', 'text-red-500');
        fixture.detectChanges();

        const iconClass = component.iconClass();
        expect(iconClass).toContain('text-red-500');
    });
});
