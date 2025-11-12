import { Component, ChangeDetectionStrategy, input, output, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FileUploadModule, FileUploadEvent } from 'primeng/fileupload';
import { FileUploadConstraints, UploadedFile } from '@shared/models';

/**
 * FileUpload component - Wraps PrimeNG FileUpload with validation
 * 
 * @example
 * ```html
 * <app-file-upload
 *   [multiple]="true"
 *   [maxFileSize]="5242880"
 *   [accept]="'image/*'"
 *   [showUploadButton]="true"
 *   (filesSelected)="handleFiles($event)">
 * </app-file-upload>
 * ```
 */
@Component({
  selector: 'app-file-upload',
  imports: [CommonModule, FileUploadModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <p-fileupload
      [name]="name()"
      [url]="url()"
      [multiple]="multiple()"
      [accept]="accept()"
      [maxFileSize]="maxFileSize()"
      [auto]="auto()"
      [customUpload]="customUpload()"
      [showUploadButton]="showUploadButton()"
      [showCancelButton]="showCancelButton()"
      [chooseLabel]="chooseLabel()"
      [uploadLabel]="uploadLabel()"
      [cancelLabel]="cancelLabel()"
      [chooseIcon]="chooseIcon()"
      [uploadIcon]="uploadIcon()"
      [cancelIcon]="cancelIcon()"
      [disabled]="disabled()"
      (onSelect)="handleSelect($event)"
      (onUpload)="handleUpload($event)"
      (onError)="handleError($event)"
      (onClear)="handleClear()"
      (onRemove)="handleRemove($event)"
      [class]="customClass()"
    >
      <ng-template pTemplate="content" let-files>
        @if (files && files.length > 0) {
          <div class="flex flex-col gap-2">
            @for (file of files; track file.name) {
              <div class="flex items-center justify-between p-3 border border-surface rounded">
                <div class="flex items-center gap-3">
                  @if (isImage(file)) {
                    <img [src]="file.objectURL" [alt]="file.name" class="w-12 h-12 object-cover rounded" />
                  } @else {
                    <i class="pi pi-file text-2xl text-muted-color"></i>
                  }
                  <div>
                    <p class="font-medium text-sm">{{ file.name }}</p>
                    <p class="text-xs text-muted-color">{{ formatFileSize(file.size) }}</p>
                  </div>
                </div>
              </div>
            }
          </div>
        }
      </ng-template>
    </p-fileupload>
  `,
  styles: []
})
export class FileUploadComponent {
  // Inputs
  name = input<string>('files');
  url = input<string>('');
  multiple = input<boolean>(false);
  accept = input<string>('');
  maxFileSize = input<number>(1048576); // 1MB default
  auto = input<boolean>(false);
  customUpload = input<boolean>(true);
  showUploadButton = input<boolean>(false);
  showCancelButton = input<boolean>(false);
  chooseLabel = input<string>('Choose');
  uploadLabel = input<string>('Upload');
  cancelLabel = input<string>('Cancel');
  chooseIcon = input<string>('pi pi-plus');
  uploadIcon = input<string>('pi pi-upload');
  cancelIcon = input<string>('pi pi-times');
  disabled = input<boolean>(false);
  customClass = input<string>('');

  // Outputs
  filesSelected = output<File[]>();
  filesUploaded = output<FileUploadEvent>();
  uploadError = output<unknown>();
  filesCleared = output<void>();
  fileRemoved = output<File>();

  isImage(file: File): boolean {
    return file.type.startsWith('image/');
  }

  formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
  }

  handleSelect(event: { currentFiles: File[] }): void {
    this.filesSelected.emit(event.currentFiles);
  }

  handleUpload(event: FileUploadEvent): void {
    this.filesUploaded.emit(event);
  }

  handleError(event: unknown): void {
    this.uploadError.emit(event);
  }

  handleClear(): void {
    this.filesCleared.emit();
  }

  handleRemove(event: { file: File }): void {
    this.fileRemoved.emit(event.file);
  }
}

