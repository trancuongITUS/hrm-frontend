# Shared Components Library

A comprehensive, production-ready component library built with **Angular 20** and **PrimeNG 20**, following **Atomic Design** principles.

## 📚 Architecture

The component library is organized into three levels following Atomic Design:

- **Atoms** - Basic building blocks (buttons, inputs, badges, etc.)
- **Molecules** - Combinations of atoms (form fields, search boxes, cards, etc.)
- **Organisms** - Complex components (data tables, modals, dynamic forms, etc.)

## 🎨 Atomic Components (Atoms)

### Core UI Atoms

#### Button
Customizable button component wrapping PrimeNG Button.

**Features:**
- Multiple variants: primary, secondary, success, danger, warning, info, text, outlined
- Three sizes: small, medium, large
- Loading state with spinner
- Icon support (leading/trailing)

```typescript
import { ButtonComponent } from '@shared/components';

<app-button 
  [variant]="'primary'" 
  [size]="'medium'"
  [loading]="isSubmitting()"
  (onClick)="handleClick()">
  Submit
</app-button>
```

#### Input
Versatile input component supporting text, email, password, and number types.

**Features:**
- Multiple input types
- Error state styling
- Prefix/suffix icon support
- Password strength indicator
- Number input with min/max

```typescript
<app-input
  [type]="'email'"
  [placeholder]="'Enter your email'"
  [hasError]="emailError()"
  [prefixIcon]="'pi pi-envelope'"
  (valueChange)="onEmailChange($event)">
</app-input>
```

#### Badge
Custom badge component for labels and status indicators.

**Features:**
- Multiple variants (default, primary, success, danger, warning, info)
- Three sizes
- Dot variant for status indicators
- Rounded option

```typescript
<app-badge [variant]="'success'" [size]="'small'">Active</app-badge>
<app-badge [variant]="'danger'" [dot]="true"></app-badge>
```

#### Avatar
Avatar component with image, initials, or icon display.

**Features:**
- Image, initials, or icon modes
- Multiple sizes
- Circle or square shapes
- Status indicator (online, offline, away, busy)

```typescript
<app-avatar 
  [image]="user.photoUrl" 
  [size]="'large'"
  [showStatus]="true"
  [status]="'online'">
</app-avatar>
```

### Feedback Atoms

#### Spinner
Loading spinner with customizable size and style.

```typescript
<app-spinner [size]="'medium'" [inline]="true"></app-spinner>
```

#### Icon
Type-safe PrimeIcons wrapper with sizing.

```typescript
<app-icon [name]="'pi-user'" [size]="'large'" [color]="'text-primary'"></app-icon>
```

#### Divider
Horizontal or vertical divider.

```typescript
<app-divider [type]="'dashed'">OR</app-divider>
```

## 🧩 Molecular Components (Molecules)

### Form Molecules

#### FormField
Combines label, input control, and error message.

```typescript
<app-form-field 
  [label]="'Email'" 
  [required]="true"
  [error]="emailError()"
  [hint]="'We will never share your email'">
  <input pInputText type="email" [(ngModel)]="email" />
</app-form-field>
```

#### SearchBox
Input with search icon, clear button, and debounced output.

**Features:**
- Debounced search (configurable delay)
- Clear button
- Loading indicator

```typescript
<app-search-box
  [placeholder]="'Search users...'"
  [debounceTime]="300"
  [loading]="isSearching()"
  (search)="onSearch($event)">
</app-search-box>
```

#### FileUpload
File upload with drag & drop, validation, and preview.

**Features:**
- Drag & drop support
- File validation (size, type)
- Image preview
- Multiple file support

```typescript
<app-file-upload
  [multiple]="true"
  [maxFileSize]="5242880"
  [accept]="'image/*'"
  (filesSelected)="handleFiles($event)">
</app-file-upload>
```

### Display Molecules

#### Card
Card component with header, body, footer, and loading state.

```typescript
<app-card 
  [header]="'User Profile'" 
  [loading]="isLoading()"
  [hoverable]="true">
  <ng-template #headerActions>
    <button pButton icon="pi pi-cog"></button>
  </ng-template>
  
  <p>Card content</p>
  
  <ng-template #footer>
    <button pButton label="Save"></button>
  </ng-template>
</app-card>
```

#### Alert
Alert/message component with multiple severity levels.

```typescript
<app-alert 
  [status]="'warning'" 
  [dismissible]="true"
  [text]="'This action cannot be undone'"
  (dismissed)="handleDismiss()">
</app-alert>
```

#### EmptyState
Display when no data is available.

```typescript
<app-empty-state
  [icon]="'pi-inbox'"
  [title]="'No messages'"
  [description]="'You have no messages in your inbox'"
  [actionLabel]="'Compose Message'"
  (action)="composeMessage()">
</app-empty-state>
```

## 🏗️ Organism Components (Organisms)

### Data Display Organisms

#### DataTable
Generic type-safe table with full CRUD support.

**Features:**
- Generic type support for type-safe columns
- Pagination, sorting, filtering
- Row selection (single/multiple)
- Custom cell templates
- Loading skeleton state
- Action buttons per row

```typescript
interface User {
  id: number;
  name: string;
  email: string;
  role: string;
}

const columns: TableColumn<User>[] = [
  { field: 'name', header: 'Name', sortable: true },
  { field: 'email', header: 'Email', sortable: true },
  { field: 'role', header: 'Role' }
];

<app-data-table
  [data]="users()"
  [columns]="columns"
  [loading]="isLoading()"
  [pagination]="paginationConfig"
  [selectionMode]="'multiple'"
  (rowSelect)="onRowSelect($event)">
</app-data-table>
```

#### DataGrid
Responsive grid layout for card-based data display.

```typescript
<app-data-grid
  [data]="products()"
  [columns]="4"
  [loading]="isLoading()"
  [paginator]="true">
  <ng-template #itemTemplate let-item>
    <div class="card">
      <img [src]="item.image" [alt]="item.name" />
      <h4>{{ item.name }}</h4>
      <p>{{ item.price | currency }}</p>
    </div>
  </ng-template>
</app-data-grid>
```

### Feedback Organisms

#### Modal
Customizable modal/dialog component.

**Features:**
- Multiple sizes (sm, md, lg, xl, full)
- Header with icon
- Configurable footer buttons
- Loading state
- Two-way binding for visibility

```typescript
<app-modal
  [(visible)]="showDialog"
  [header]="'Edit User'"
  [size]="'lg'"
  [loading]="isSaving()"
  (confirm)="saveUser()"
  (cancel)="closeDialog()">
  <form><!-- Form content --></form>
</app-modal>
```

#### ConfirmDialog
Service-based confirmation dialogs with Promise API.

**Setup:**
Place in app root once:
```typescript
<app-confirm-dialog></app-confirm-dialog>
```

**Usage:**
```typescript
import { ConfirmDialogService } from '@shared/components';

constructor(private confirmDialog: ConfirmDialogService) {}

async deleteUser(user: User) {
  const confirmed = await this.confirmDialog.confirmDelete(user.name);
  if (confirmed) {
    // Perform delete
  }
}

// Or use the generic confirm method
const result = await this.confirmDialog.confirm({
  header: 'Publish Article',
  message: 'Are you sure you want to publish this article?',
  acceptLabel: 'Publish'
});
```

### Form Organisms

#### DynamicForm
JSON-driven form generation with full validation.

**Features:**
- JSON configuration
- All field types (text, email, select, multiselect, checkbox, etc.)
- Built-in validation
- Conditional field visibility
- Responsive grid layout
- Custom error messages

```typescript
const formConfig: FormFieldConfig[] = [
  {
    name: 'email',
    label: 'Email',
    type: 'email',
    required: true,
    validators: [Validators.email],
    errorMessages: {
      required: 'Email is required',
      email: 'Please enter a valid email'
    }
  },
  {
    name: 'role',
    label: 'Role',
    type: 'select',
    required: true,
    options: [
      { label: 'Admin', value: 'admin' },
      { label: 'User', value: 'user' }
    ]
  },
  {
    name: 'notifyByEmail',
    label: 'Email Notifications',
    type: 'switch',
    value: true
  }
];

<app-dynamic-form
  [fields]="formConfig"
  [columns]="2"
  (formSubmit)="handleSubmit($event)">
  <div class="flex justify-end gap-2 mt-4">
    <button pButton label="Cancel" severity="secondary"></button>
    <button pButton label="Submit" type="submit"></button>
  </div>
</app-dynamic-form>
```

## 🎯 Technical Standards

All components follow these standards:

### Modern Angular 20 Patterns
- ✅ `input()` and `output()` functions (not decorators)
- ✅ `inject()` for dependency injection
- ✅ `computed()` for derived state
- ✅ `@if`, `@for`, `@switch` (new control flow)
- ✅ Native `[class.active]` and `[style.width.px]` bindings
- ✅ `ChangeDetectionStrategy.OnPush` for all components
- ✅ Signals for reactive state

### Performance
- Optimized change detection
- TrackBy functions for loops
- Lazy loading support

### Accessibility
- Proper ARIA labels and roles
- Keyboard navigation support
- Focus management

### Type Safety
- Generic types where appropriate
- Strict TypeScript
- No `any` types

### Styling
- TailwindCSS + PrimeNG themes
- Responsive design (mobile-first)
- Dark mode support

## 📦 Shared Models

Type-safe models for consistent component interfaces:

- **component-types.model.ts** - Common types (Size, Variant, Status)
- **form-types.model.ts** - Form-related interfaces
- **table-types.model.ts** - Table column, pagination interfaces

## 🚀 Usage

All components are exported from the shared barrel:

```typescript
import { 
  ButtonComponent,
  InputComponent,
  DataTableComponent,
  ModalComponent,
  DynamicFormComponent 
} from '@shared/components';
```

Or import specific atomic levels:

```typescript
import { ButtonComponent, BadgeComponent } from '@shared/components/atoms';
import { CardComponent, AlertComponent } from '@shared/components/molecules';
import { DataTableComponent } from '@shared/components/organisms';
```

## 🧪 Testing

All components include comprehensive unit tests with:
- Component creation tests
- Input/output behavior tests
- State change tests
- Computed property tests

Run tests:
```bash
ng test
```

## 📝 Notes

- All components are standalone (no NgModules)
- Components use PrimeNG 20 under the hood for consistency
- Fully compatible with Angular 20's latest features
- Ready for production use

