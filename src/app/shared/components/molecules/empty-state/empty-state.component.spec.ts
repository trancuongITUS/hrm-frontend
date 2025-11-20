import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EmptyStateComponent } from './empty-state.component';

describe('EmptyStateComponent', () => {
    let component: EmptyStateComponent;
    let fixture: ComponentFixture<EmptyStateComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [EmptyStateComponent]
        }).compileComponents();

        fixture = TestBed.createComponent(EmptyStateComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should have default icon', () => {
        expect(component.icon()).toBe('pi-inbox');
    });

    it('should have default title', () => {
        expect(component.title()).toBe('No data available');
    });

    it('should have default action severity as primary', () => {
        expect(component.actionSeverity()).toBe('primary');
    });

    it('should emit action event when handleAction is called', () => {
        let actionEmitted = false;
        component.action.subscribe(() => {
            actionEmitted = true;
        });

        component.handleAction();
        expect(actionEmitted).toBe(true);
    });
});
