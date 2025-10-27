# Architecture Diagram

**Visual representation of the enterprise architecture structure**

---

## 🏗️ Layer Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                      APPLICATION SHELL                      │
│                    (src/app.component.ts)                   │
└───────────────────────┬─────────────────────────────────────┘
                        │
                        ▼
┌─────────────────────────────────────────────────────────────┐
│                     ROUTING LAYER                           │
│                   (src/app.routes.ts)                       │
└───────┬─────────────────────┬───────────────────────────────┘
        │                     │
        ▼                     ▼
┌──────────────┐      ┌──────────────────────────────────────┐
│   LAYOUT     │      │            PAGES                     │
│   LAYER      │      │      (Top-level routes)              │
│              │      │  ┌────────────────────────────────┐  │
│  • Topbar    │◄─────┤  │ Auth (login, access, error)    │  │
│  • Sidebar   │      │  │ Landing                        │  │
│  • Footer    │      │  │ Not Found (404)                │  │
│  • Menu      │      │  │ Documentation                  │  │
│              │      │  │ Empty                          │  │
└──────┬───────┘      │  └────────────────────────────────┘  │
       │              └──────────────────────────────────────┘
       │
       ▼
┌─────────────────────────────────────────────────────────────┐
│                     FEATURES LAYER                          │
│              (Business Domain Modules)                      │
│  ┌─────────────┐  ┌─────────────┐  ┌──────────────────┐     │
│  │  Dashboard  │  │    CRUD     │  │      UIKit       │     │
│  │             │  │             │  │                  │     │
│  │ • Widgets   │  │ • Products  │  │ • Button Demo    │     │
│  │ • Charts    │  │ • Table     │  │ • Chart Demo     │     │
│  │ • Stats     │  │ • CRUD Ops  │  │ • Form Demo      │     │
│  └─────────────┘  └─────────────┘  │ • Table Demo     │     │
│                                    │ • ... 15+ demos  │     │
│                                    └──────────────────┘     │
└─────────────┬───────────────────────────────────────────────┘
              │
              ▼
┌─────────────────────────────────────────────────────────────┐
│                      SHARED LAYER                           │
│              (Reusable Components & Utilities)              │
│  ┌───────────────┐  ┌─────────────┐  ┌──────────────────┐   │
│  │  Components   │  │ Directives  │  │      Pipes       │   │
│  │  • UI         │  │             │  │                  │   │
│  │  • Layout     │  │             │  │                  │   │
│  └───────────────┘  └─────────────┘  └──────────────────┘   │
└─────────────┬───────────────────────────────────────────────┘
              │
              ▼
┌─────────────────────────────────────────────────────────────┐
│                       CORE LAYER                            │
│          (Singleton Services & Configuration)               │
│  ┌───────────────┐  ┌─────────────┐  ┌──────────────────┐   │
│  │   Services    │  │   Config    │  │     Utils        │   │
│  │  • Product    │  │             │  │                  │   │
│  │  • Customer   │  │             │  │                  │   │
│  │  • Country    │  │             │  │                  │   │
│  │  • Photo      │  │             │  │                  │   │
│  │  • Node       │  │             │  │                  │   │
│  │  • Icon       │  │             │  │                  │   │
│  └───────────────┘  └─────────────┘  └──────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

---

## 📊 Data Flow

```
┌─────────────────┐
│   User Action   │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│   Component     │ ◄─── Renders UI, handles user input
│  (Smart/Dumb)   │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│   Service       │ ◄─── Business logic, data fetching
│  (Core/Feature) │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│   HTTP/API      │ ◄─── Backend communication
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│   Response      │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│   Component     │ ◄─── Updates UI with new data
│   (Re-render)   │
└─────────────────┘
```

---

## 🔄 Component Interaction

```
┌──────────────────────────────────────────────────────────┐
│                    App Layout                            │
│  ┌──────────────────────────────────────────────────┐    │
│  │                  Topbar                          │    │
│  │  ┌────────┐  ┌────────┐  ┌──────────────────┐    │    │
│  │  │  Logo  │  │  Menu  │  │  Configurator    │    │    │
│  │  └────────┘  └────────┘  └──────────────────┘    │    │
│  └──────────────────────────────────────────────────┘    │
│                                                          │
│  ┌───────────┐  ┌───────────────────────────────────┐    │
│  │           │  │                                   │    │
│  │  Sidebar  │  │         Main Content              │    │
│  │           │  │                                   │    │
│  │  ┌─────┐  │  │  ┌──────────────────────────┐     │    │
│  │  │Menu │  │  │  │     Feature Module       │     │    │
│  │  │Items│  │  │  │   (Dashboard/CRUD/etc)   │     │    │
│  │  └─────┘  │  │  └──────────────────────────┘     │    │
│  │           │  │                                   │    │
│  └───────────┘  └───────────────────────────────────┘    │
│                                                          │
│  ┌──────────────────────────────────────────────────┐    │
│  │                   Footer                         │    │
│  └──────────────────────────────────────────────────┘    │
└──────────────────────────────────────────────────────────┘
```

---

## 🗂️ Folder Structure Tree

```
src/app/
│
├── 📦 core/                     [Application Core]
│   ├── services/
│   │   └── data/                [Data Access Services]
│   │       ├── country.service.ts
│   │       ├── customer.service.ts
│   │       ├── icon.service.ts
│   │       ├── node.service.ts
│   │       ├── photo.service.ts
│   │       ├── product.service.ts
│   │       └── index.ts
│   ├── config/                  [App Configuration]
│   ├── utils/                   [Utility Functions]
│   └── index.ts
│
├── 🎨 shared/                   [Shared Resources]
│   ├── components/
│   │   ├── ui/                  [Reusable UI Components]
│   │   └── layout/              [Layout Components]
│   ├── directives/              [Custom Directives]
│   ├── pipes/                   [Custom Pipes]
│   ├── models/                  [Shared Models/Interfaces]
│   ├── validators/              [Custom Validators]
│   └── index.ts
│
├── ⚡ features/                 [Business Features]
│   ├── dashboard/
│   │   ├── components/
│   │   │   ├── bestsellingwidget.ts
│   │   │   ├── notificationswidget.ts
│   │   │   ├── recentsaleswidget.ts
│   │   │   ├── revenuestreamwidget.ts
│   │   │   ├── statswidget.ts
│   │   │   └── index.ts
│   │   ├── services/
│   │   ├── dashboard.ts
│   │   ├── dashboard.routes.ts
│   │   └── index.ts
│   │
│   ├── crud/
│   │   ├── components/
│   │   │   ├── crud.ts
│   │   │   └── index.ts
│   │   ├── services/
│   │   ├── models/
│   │   ├── crud.routes.ts
│   │   └── index.ts
│   │
│   └── uikit/
│       ├── components/          [15+ Demo Components]
│       │   ├── buttondemo.ts
│       │   ├── chartdemo.ts
│       │   ├── filedemo.ts
│       │   └── ... (more demos)
│       └── uikit.routes.ts
│
├── 🏛️ layout/                  [Application Shell]
│   ├── components/
│   │   ├── app.layout.ts
│   │   ├── app.topbar.ts
│   │   ├── app.sidebar.ts
│   │   ├── app.footer.ts
│   │   ├── app.menu.ts
│   │   ├── app.menuitem.ts
│   │   ├── app.configurator.ts
│   │   ├── app.floatingconfigurator.ts
│   │   └── index.ts
│   ├── services/
│   │   ├── layout.service.ts
│   │   └── index.ts
│   └── index.ts
│
└── 📄 pages/                    [Top-Level Pages]
    ├── auth/
    │   ├── login.ts
    │   ├── access.ts
    │   ├── error.ts
    │   └── auth.routes.ts
    ├── landing/
    │   ├── components/
    │   └── landing.ts
    ├── notfound/
    │   └── notfound.ts
    ├── documentation/
    │   └── documentation.ts
    ├── empty/
    │   └── empty.ts
    └── pages.routes.ts
```

---

## 🔀 Routing Flow

```
User navigates to URL
         │
         ▼
┌─────────────────────┐
│   app.routes.ts     │ ◄─── Root routing configuration
└──────────┬──────────┘
           │
           ├─────────────┐
           │             │
           ▼             ▼
    ┌───────────┐  ┌──────────────┐
    │  Layout   │  │    Pages     │
    │  Routes   │  │   Routes     │
    └─────┬─────┘  └──────┬───────┘
          │               │
          ▼               ▼
    ┌───────────┐    ┌──────────┐
    │ Dashboard │    │   Auth   │
    │   CRUD    │    │  Landing │
    │  UIKit    │    │   404    │
    └───────────┘    └──────────┘
```

### Lazy Loading Flow

```
User clicks "UI Kit"
        │
        ▼
Router initiates lazy load
        │
        ▼
Loads uikit.routes.ts
        │
        ▼
Loads required components
        │
        ▼
Renders UI Kit page
```

---

## 🔐 Dependency Injection Flow

```
┌─────────────────────┐
│    Component        │
│                     │
│  constructor(       │
│    private service  │◄─── Inject service
│  ) {}               │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│  Angular Injector   │ ◄─── Resolves dependency
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│  Service Instance   │ ◄─── Singleton from 'providedIn: root'
│  (ProductService)   │
└─────────────────────┘
```

---

## 📱 State Management Pattern

```
┌────────────────────────────────────────────────────┐
│                  Component                         │
│                                                    │
│  ┌──────────────┐         ┌──────────────────┐     │
│  │   Template   │◄────────┤   Component TS   │     │
│  │              │  Binds  │                  │     │
│  │  <div>       │         │  data = signal() │     │
│  │    {{data}}  │         │                  │     │
│  │  </div>      │         │  loadData() {    │     │
│  └──────────────┘         │    service.get() │     │
│                           │  }               │     │
│                           └─────────┬────────┘     │
└─────────────────────────────────────┼──────────────┘
                                      │
                                      ▼
                         ┌────────────────────────┐
                         │   Service Layer        │
                         │                        │
                         │  @Injectable()         │
                         │  class DataService {   │
                         │    getData() {         │
                         │      return http.get() │
                         │    }                   │
                         │  }                     │
                         └────────────────────────┘
```

---

## 🎯 Import Resolution

```
Component imports service:
import { ProductService } from '@core/services/data/product.service';
                                  ↓
Path alias resolution (tsconfig.json):
'@core/*' → 'src/app/core/*'
                                  ↓
Actual file path:
src/app/core/services/data/product.service.ts
                                  ↓
TypeScript resolves import
                                  ↓
Service is available in component
```

---

## 🔄 Barrel Export Resolution

```
Import from barrel:
import { ProductService } from '@core/services';
                ↓
Barrel export (core/services/index.ts):
export * from './data';
                ↓
Data barrel (core/services/data/index.ts):
export * from './product.service';
                ↓
Actual file (core/services/data/product.service.ts):
export class ProductService { }
                ↓
Service is available
```

---

## 📊 Build Process Flow

```
npm run build
      │
      ▼
Angular CLI
      │
      ├──────────────┐
      │              │
      ▼              ▼
  Compile TS    Bundle Files
      │              │
      ├──────────────┤
      │
      ▼
  Optimize
      │
      ├─── Tree shake
      ├─── Minify
      └─── Compress
      │
      ▼
  dist/
      ├── main.js
      ├── polyfills.js
      ├── styles.css
      └── lazy chunks/
          ├── uikit-routes.js
          ├── auth-routes.js
          └── crud-routes.js
```

---

## 🎨 Theme Configuration Flow

```
User clicks theme button
         │
         ▼
LayoutService.changeTheme()
         │
         ▼
PrimeNG theme preset selected
         │
         ▼
CSS variables updated
         │
         ▼
UI re-renders with new theme
```

---

## 📦 Module Dependencies

```
┌──────────────────────────────────────────────┐
│            Application                       │
│                                              │
│  ┌─────────────────────────────────────┐     │
│  │          Features                   │     │
│  │  ┌──────────┐  ┌──────────────┐     │     │
│  │  │Dashboard │  │     CRUD     │     │     │
│  │  └────┬─────┘  └──────┬───────┘     │     │
│  └───────┼───────────────┼─────────────┘     │
│          │               │                   │
│  ┌───────▼───────────────▼─────────────┐     │
│  │          Shared                     │     │
│  │  (Components, Pipes, Directives)    │     │
│  └──────────────┬──────────────────────┘     │
│                 │                            │
│  ┌──────────────▼───────────────────────┐    │
│  │           Core                       │    │
│  │  (Services, Utils, Config)           │    │
│  └──────────────────────────────────────┘    │
│                                              │
│  Dependencies flow: Features → Shared → Core │
└──────────────────────────────────────────────┘
```

---

**Visual Guide Version:** 1.0  
**Last Updated:** October 27, 2025  
**Reference:** See `architecture.md` for detailed guidelines

