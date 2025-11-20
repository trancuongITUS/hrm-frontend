import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DividerComponent } from './divider.component';

describe('DividerComponent', () => {
    let component: DividerComponent;
    let fixture: ComponentFixture<DividerComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [DividerComponent]
        }).compileComponents();

        fixture = TestBed.createComponent(DividerComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should have default layout as horizontal', () => {
        expect(component.layout()).toBe('horizontal');
    });

    it('should have default type as solid', () => {
        expect(component.type()).toBe('solid');
    });

    it('should have default align as center', () => {
        expect(component.align()).toBe('center');
    });
});
