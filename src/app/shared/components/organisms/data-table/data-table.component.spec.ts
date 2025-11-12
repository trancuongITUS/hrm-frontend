import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DataTableComponent } from './data-table.component';

describe('DataTableComponent', () => {
  let component: DataTableComponent;
  let fixture: ComponentFixture<DataTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DataTableComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(DataTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have paginator enabled by default', () => {
    expect(component.paginator()).toBe(true);
  });

  it('should have row hover enabled by default', () => {
    expect(component.rowHover()).toBe(true);
  });

  it('should calculate total columns correctly', () => {
    fixture.componentRef.setInput('columns', [
      { field: 'id', header: 'ID' },
      { field: 'name', header: 'Name' }
    ]);
    fixture.detectChanges();

    expect(component.totalColumns()).toBe(2);
  });

  it('should calculate total columns with selection', () => {
    fixture.componentRef.setInput('columns', [
      { field: 'id', header: 'ID' },
      { field: 'name', header: 'Name' }
    ]);
    fixture.componentRef.setInput('selectionMode', 'single');
    fixture.detectChanges();

    expect(component.totalColumns()).toBe(3);
  });

  it('should emit selectionChange event', () => {
    const testData = { id: 1, name: 'Test' };
    let emitted: unknown = null;

    component.selectionChange.subscribe((selection) => {
      emitted = selection;
    });

    component.handleSelectionChange(testData);
    expect(emitted).toEqual(testData);
  });
});

