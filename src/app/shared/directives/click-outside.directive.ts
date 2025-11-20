import { Directive, ElementRef, EventEmitter, HostListener, Output } from '@angular/core';

/**
 * Directive to detect clicks outside of the host element
 * Useful for closing dropdowns, modals, and popups
 *
 * @example
 * <div appClickOutside (clickOutside)="closeDropdown()">
 *   Dropdown content
 * </div>
 */
@Directive({
    selector: '[appClickOutside]',
    standalone: true
})
export class ClickOutsideDirective {
    @Output() clickOutside = new EventEmitter<void>();

    constructor(private elementRef: ElementRef<HTMLElement>) {}

    @HostListener('document:click', ['$event.target'])
    onClick(target: HTMLElement): void {
        const clickedInside = this.elementRef.nativeElement.contains(target);
        if (!clickedInside) {
            this.clickOutside.emit();
        }
    }
}
