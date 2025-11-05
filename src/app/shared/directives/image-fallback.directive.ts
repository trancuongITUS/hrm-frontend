import { Directive, ElementRef, HostListener, Input } from '@angular/core';

/**
 * Directive to handle image loading errors with fallback
 * Displays a fallback image when the primary image fails to load
 *
 * @example
 * <img [src]="userAvatar" appImageFallback [fallbackSrc]="defaultAvatar" />
 * <img [src]="productImage" appImageFallback />
 */
@Directive({
  selector: '[appImageFallback]',
  standalone: true,
})
export class ImageFallbackDirective {
  @Input() fallbackSrc: string = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"%3E%3Crect fill="%23e0e0e0" width="100" height="100"/%3E%3Ctext x="50" y="50" font-size="14" text-anchor="middle" dy=".3em" fill="%23999"%3ENo Image%3C/text%3E%3C/svg%3E';

  private isLoadingFallback = false;

  constructor(private elementRef: ElementRef<HTMLImageElement>) {}

  @HostListener('error')
  onError(): void {
    if (!this.isLoadingFallback) {
      this.isLoadingFallback = true;
      this.elementRef.nativeElement.src = this.fallbackSrc;
    }
  }

  @HostListener('load')
  onLoad(): void {
    // Reset flag on successful load
    this.isLoadingFallback = false;
  }
}

