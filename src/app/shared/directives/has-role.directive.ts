import { Directive, Input, OnDestroy, OnInit, TemplateRef, ViewContainerRef } from '@angular/core';
import { Subject } from 'rxjs';

/**
 * Structural directive to show/hide elements based on user roles
 * Requires an auth service to be implemented in core/auth
 *
 * @example
 * <button *appHasRole="'admin'">Admin Panel</button>
 * <div *appHasRole="['admin', 'manager']">Management Options</div>
 */
@Directive({
    selector: '[appHasRole]',
    standalone: true
})
export class HasRoleDirective implements OnInit, OnDestroy {
    @Input() appHasRole: string | string[] = [];

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
        const hasRole = this.checkRole();

        if (hasRole && !this.hasView) {
            this.viewContainer.createEmbeddedView(this.templateRef);
            this.hasView = true;
        } else if (!hasRole && this.hasView) {
            this.viewContainer.clear();
            this.hasView = false;
        }
    }

    private checkRole(): boolean {
        // TODO: Inject AuthService from core
        // For now, return true as a placeholder
        // In production, implement:
        // return this.authService.hasRole(this.appHasRole);

        // Placeholder logic - replace with actual role check
        if (Array.isArray(this.appHasRole)) {
            return this.appHasRole.length > 0;
        }
        return !!this.appHasRole;
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }
}
