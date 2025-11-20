import { Directive, Input, OnDestroy, OnInit, TemplateRef, ViewContainerRef } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

/**
 * Structural directive to show/hide elements based on user permissions
 * Requires a permission service to be implemented in core/auth
 *
 * @example
 * <button *appHasPermission="'employee.create'">Create Employee</button>
 * <div *appHasPermission="['employee.edit', 'employee.delete']">Edit Options</div>
 */
@Directive({
    selector: '[appHasPermission]',
    standalone: true
})
export class HasPermissionDirective implements OnInit, OnDestroy {
    @Input() appHasPermission: string | string[] = [];

    private destroy$ = new Subject<void>();
    private hasView = false;

    constructor(
        private templateRef: TemplateRef<unknown>,
        private viewContainer: ViewContainerRef
    ) {}

    ngOnInit(): void {
        this.updateView();
    }

    private updateView(): void {
        const hasPermission = this.checkPermission();

        if (hasPermission && !this.hasView) {
            this.viewContainer.createEmbeddedView(this.templateRef);
            this.hasView = true;
        } else if (!hasPermission && this.hasView) {
            this.viewContainer.clear();
            this.hasView = false;
        }
    }

    private checkPermission(): boolean {
        // TODO: Inject AuthService or PermissionService from core
        // For now, return true as a placeholder
        // In production, implement:
        // return this.authService.hasPermission(this.appHasPermission);

        // Placeholder logic - replace with actual permission check
        if (Array.isArray(this.appHasPermission)) {
            return this.appHasPermission.length > 0;
        }
        return !!this.appHasPermission;
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }
}
