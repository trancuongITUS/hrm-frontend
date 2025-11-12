import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FileUploadComponent } from './file-upload.component';

describe('FileUploadComponent', () => {
  let component: FileUploadComponent;
  let fixture: ComponentFixture<FileUploadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FileUploadComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(FileUploadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have default maxFileSize of 1MB', () => {
    expect(component.maxFileSize()).toBe(1048576);
  });

  it('should not be multiple by default', () => {
    expect(component.multiple()).toBe(false);
  });

  it('should correctly identify image files', () => {
    const imageFile = new File([''], 'test.png', { type: 'image/png' });
    expect(component.isImage(imageFile)).toBe(true);

    const textFile = new File([''], 'test.txt', { type: 'text/plain' });
    expect(component.isImage(textFile)).toBe(false);
  });

  it('should format file size correctly', () => {
    expect(component.formatFileSize(0)).toBe('0 Bytes');
    expect(component.formatFileSize(1024)).toBe('1 KB');
    expect(component.formatFileSize(1048576)).toBe('1 MB');
  });

  it('should emit filesSelected event when files are selected', () => {
    const files = [new File([''], 'test.txt', { type: 'text/plain' })];
    let emittedFiles: File[] = [];

    component.filesSelected.subscribe((selectedFiles) => {
      emittedFiles = selectedFiles;
    });

    component.handleSelect({ currentFiles: files });

    expect(emittedFiles).toEqual(files);
  });
});

