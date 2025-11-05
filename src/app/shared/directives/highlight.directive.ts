import {
  Directive,
  ElementRef,
  HostListener,
  Input,
  OnInit,
  Renderer2,
} from '@angular/core';

/**
 * Directive to highlight text on hover or permanently
 * Useful for drawing attention to important elements
 *
 * @example
 * <p appHighlight [highlightColor]="'yellow'">Hover to highlight</p>
 * <span appHighlight [highlightColor]="'#ffeb3b'" [permanent]="true">Always highlighted</span>
 */
@Directive({
  selector: '[appHighlight]',
  standalone: true,
})
export class HighlightDirective implements OnInit {
  @Input() highlightColor: string = '#ffd54f';
  @Input() defaultColor: string = 'transparent';
  @Input() permanent: boolean = false;

  constructor(
    private elementRef: ElementRef<HTMLElement>,
    private renderer: Renderer2
  ) {}

  ngOnInit(): void {
    if (this.permanent) {
      this.setBackgroundColor(this.highlightColor);
    } else {
      this.setBackgroundColor(this.defaultColor);
    }
  }

  @HostListener('mouseenter')
  onMouseEnter(): void {
    if (!this.permanent) {
      this.setBackgroundColor(this.highlightColor);
    }
  }

  @HostListener('mouseleave')
  onMouseLeave(): void {
    if (!this.permanent) {
      this.setBackgroundColor(this.defaultColor);
    }
  }

  private setBackgroundColor(color: string): void {
    this.renderer.setStyle(
      this.elementRef.nativeElement,
      'backgroundColor',
      color
    );
  }
}

