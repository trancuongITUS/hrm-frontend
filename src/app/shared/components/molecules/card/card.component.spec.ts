import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CardComponent } from './card.component';

describe('CardComponent', () => {
    let component: CardComponent;
    let fixture: ComponentFixture<CardComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [CardComponent]
        }).compileComponents();

        fixture = TestBed.createComponent(CardComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should not be loading by default', () => {
        expect(component.loading()).toBe(false);
    });

    it('should not be hoverable by default', () => {
        expect(component.hoverable()).toBe(false);
    });

    it('should apply hoverable classes when hoverable is true', () => {
        fixture.componentRef.setInput('hoverable', true);
        fixture.detectChanges();

        const cardClass = component.cardClass();
        expect(cardClass).toContain('hover:shadow-lg');
    });

    it('should apply custom classes', () => {
        fixture.componentRef.setInput('customClass', 'custom-card-class');
        fixture.detectChanges();

        const cardClass = component.cardClass();
        expect(cardClass).toContain('custom-card-class');
    });
});
