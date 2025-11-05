import {
  Directive,
  ElementRef,
  EventEmitter,
  HostListener,
  Input,
  Output,
} from '@angular/core';

/**
 * Directive to copy text to clipboard on click
 * Emits success/error events for user feedback
 *
 * @example
 * <button appCopyToClipboard [copyText]="'Hello World'" (copied)="onCopied()">
 *   Copy Text
 * </button>
 * <input appCopyToClipboard [copyText]="userEmail" (copyError)="onError()" />
 */
@Directive({
  selector: '[appCopyToClipboard]',
  standalone: true,
})
export class CopyToClipboardDirective {
  @Input() copyText: string = '';
  @Input() copyFromElement: boolean = false;
  @Output() copied = new EventEmitter<string>();
  @Output() copyError = new EventEmitter<Error>();

  constructor(private elementRef: ElementRef<HTMLElement>) {}

  @HostListener('click', ['$event'])
  onClick(event: Event): void {
    event.preventDefault();
    this.copyToClipboard();
  }

  private async copyToClipboard(): Promise<void> {
    try {
      const textToCopy = this.getTextToCopy();

      if (!textToCopy) {
        throw new Error('No text to copy');
      }

      if (navigator.clipboard && window.isSecureContext) {
        // Modern async clipboard API
        await navigator.clipboard.writeText(textToCopy);
      } else {
        // Fallback for older browsers
        this.fallbackCopyToClipboard(textToCopy);
      }

      this.copied.emit(textToCopy);
    } catch (error) {
      this.copyError.emit(
        error instanceof Error ? error : new Error('Failed to copy')
      );
    }
  }

  private getTextToCopy(): string {
    if (this.copyFromElement) {
      return this.elementRef.nativeElement.textContent?.trim() || '';
    }
    return this.copyText;
  }

  private fallbackCopyToClipboard(text: string): void {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.left = '-999999px';
    textArea.style.top = '-999999px';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();

    try {
      document.execCommand('copy');
    } finally {
      document.body.removeChild(textArea);
    }
  }
}

