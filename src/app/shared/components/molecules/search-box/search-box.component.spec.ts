import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { SearchBoxComponent } from './search-box.component';

describe('SearchBoxComponent', () => {
    let component: SearchBoxComponent;
    let fixture: ComponentFixture<SearchBoxComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [SearchBoxComponent]
        }).compileComponents();

        fixture = TestBed.createComponent(SearchBoxComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should have default placeholder', () => {
        expect(component.placeholder()).toBe('Search...');
    });

    it('should have default debounce time of 300ms', () => {
        expect(component.debounceTime()).toBe(300);
    });

    it('should emit search event after debounce time', fakeAsync(() => {
        let emittedValue = '';
        component.search.subscribe((value) => {
            emittedValue = value;
        });

        component.searchValue.set('test');
        component.handleSearch();

        tick(299);
        expect(emittedValue).toBe('');

        tick(1);
        expect(emittedValue).toBe('test');
    }));

    it('should clear search value and emit events on clearSearch', () => {
        component.searchValue.set('test value');

        let searchEmitted = false;
        let clearEmitted = false;

        component.search.subscribe(() => {
            searchEmitted = true;
        });

        component.clear.subscribe(() => {
            clearEmitted = true;
        });

        component.clearSearch();

        expect(component.searchValue()).toBe('');
        expect(searchEmitted).toBe(true);
        expect(clearEmitted).toBe(true);
    });
});
