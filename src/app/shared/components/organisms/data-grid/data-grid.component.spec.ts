import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DataGridComponent } from './data-grid.component';

describe('DataGridComponent', () => {
  let component: DataGridComponent;
  let fixture: ComponentFixture<DataGridComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DataGridComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(DataGridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have default columns of 3', () => {
    expect(component.columns()).toBe(3);
  });

  it('should have paginator disabled by default', () => {
    expect(component.paginator()).toBe(false);
  });

  it('should have default rows of 12', () => {
    expect(component.rows()).toBe(12);
  });

  it('should generate correct grid classes for different column counts', () => {
    fixture.componentRef.setInput('columns', 4);
    fixture.detectChanges();
    
    const gridClass = component.gridClass();
    expect(gridClass).toContain('grid');
    expect(gridClass).toContain('xl:grid-cols-4');
  });

  it('should emit pageChange event', () => {
    let emittedEvent: unknown = null;

    component.pageChange.subscribe((event) => {
      emittedEvent = event;
    });

    const mockEvent = { first: 0, rows: 12, page: 0, pageCount: 5 };
    component.handlePageChange(mockEvent);

    expect(emittedEvent).toEqual(mockEvent);
  });
});

