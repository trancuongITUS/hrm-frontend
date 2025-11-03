# HRM Frontend Documentation

**Version:** Angular 20  
**Project Type:** Human Resource Management System  
**Architecture Pattern:** Feature-Based Modular Design with Standalone Components  
**Last Updated:** November 2025

---

## 📚 Quick Navigation

### 🏗️ Architecture Documentation

**Core Architecture Concepts**
- [📖 Overview & Architectural Principles](architecture/01-overview.md) - Core principles, SOLID, reactive-first approach
- [📁 Project Structure](architecture/02-project-structure.md) - Complete folder structure and organization
- [🏛️ Layer Architecture](architecture/03-layer-architecture.md) - Core, Shared, Feature, Layout, and Pages layers
- [🏷️ Naming Conventions](architecture/04-naming-conventions.md) - Files, classes, variables, and function naming standards

**Component & State Architecture**
- [🧩 Component Architecture](architecture/05-component-architecture.md) - Smart vs. Dumb components, lifecycle, best practices
- [🔄 State Management](architecture/06-state-management.md) - Local state, service-based state, NgRx/Signal Store patterns
- [🛤️ Routing Strategy](architecture/07-routing-strategy.md) - Route configuration, guards, resolvers, lazy loading
- [📊 Data Flow Patterns](architecture/08-data-flow-patterns.md) - Service layer patterns, API response models

### ⚙️ Core Systems

**Infrastructure Layer**
- [🔧 Configuration Layer](core/configuration-layer.md) - AppConfigService, API endpoints, constants management
- [🌐 HTTP Communication](core/http-layer.md) - BaseHttpService, type-safe requests, pagination, retry logic
- [⚠️ Error Handling & Notifications](core/error-handling.md) - Global error handler, logging, toast notifications

### ✨ Best Practices

**Development Guidelines**
- [📝 Code Organization](best-practices/code-organization.md) - Barrel exports, path aliases, dependency injection
- [🧪 Testing Strategy](best-practices/testing-strategy.md) - Unit tests, integration tests, E2E testing
- [⚡ Performance Optimization](best-practices/performance.md) - Lazy loading, OnPush, virtual scrolling, image optimization
- [🔐 Security](best-practices/security.md) - Authentication, authorization, sanitization, CSRF protection

### 📈 Additional Resources

- [🚀 Scalability Guidelines](scalability.md) - Module boundaries, code splitting, monitoring, performance budgets
- [📜 Architecture Changelog](architecture/changelog.md) - Version history and architectural changes
- [🎨 Architecture Diagrams](architecture-diagram.md) - Visual representation of the system architecture

---

## 🎯 Where to Start?

### New Team Members
1. Start with [Overview & Principles](architecture/01-overview.md)
2. Review [Project Structure](architecture/02-project-structure.md)
3. Understand [Layer Architecture](architecture/03-layer-architecture.md)
4. Learn [Component Architecture](architecture/05-component-architecture.md)
5. Explore [Code Organization](best-practices/code-organization.md)

### Working on Features
- [Component Architecture](architecture/05-component-architecture.md) - Building components
- [State Management](architecture/06-state-management.md) - Managing component state
- [Data Flow Patterns](architecture/08-data-flow-patterns.md) - API integration
- [HTTP Communication](core/http-layer.md) - Making API calls

### Setting Up Infrastructure
- [Configuration Layer](core/configuration-layer.md) - App configuration
- [HTTP Communication](core/http-layer.md) - HTTP service setup
- [Error Handling](core/error-handling.md) - Error management
- [Routing Strategy](architecture/07-routing-strategy.md) - Route setup

### Implementing Best Practices
- [Code Organization](best-practices/code-organization.md) - Code structure
- [Testing Strategy](best-practices/testing-strategy.md) - Writing tests
- [Performance Optimization](best-practices/performance.md) - Optimizing app
- [Security](best-practices/security.md) - Security measures

---

## 📖 Documentation Standards

Each documentation file follows these standards:

- **Clear Purpose**: Every document starts with a brief description of its content
- **Table of Contents**: For easy navigation within the document
- **Code Examples**: Practical, real-world examples included
- **Cross-References**: Links to related documentation
- **Best Practices**: Actionable guidelines and recommendations
- **Anti-Patterns**: What to avoid and why

---

## 🔄 Keeping Documentation Updated

When making architectural changes:

1. Update the relevant documentation file
2. Add entry to [Architecture Changelog](architecture/changelog.md)
3. Update cross-references in related documents
4. Review [Architecture Diagrams](architecture-diagram.md) for visual accuracy

---

## 💡 Contributing to Documentation

- Follow the existing structure and formatting
- Include practical code examples
- Cross-reference related documents
- Keep examples up-to-date with latest Angular features
- Use TypeScript strict mode in all examples

---

**Documentation Version:** 2.0  
**Last Major Update:** November 2025  
**Maintained By:** Frontend Architecture Team

---

## Quick Links Summary

| Category | Documents |
|----------|-----------|
| **Core Concepts** | [Overview](architecture/01-overview.md) · [Structure](architecture/02-project-structure.md) · [Layers](architecture/03-layer-architecture.md) · [Naming](architecture/04-naming-conventions.md) |
| **Components & State** | [Components](architecture/05-component-architecture.md) · [State](architecture/06-state-management.md) · [Routing](architecture/07-routing-strategy.md) · [Data Flow](architecture/08-data-flow-patterns.md) |
| **Core Systems** | [Configuration](core/configuration-layer.md) · [HTTP](core/http-layer.md) · [Error Handling](core/error-handling.md) |
| **Best Practices** | [Organization](best-practices/code-organization.md) · [Testing](best-practices/testing-strategy.md) · [Performance](best-practices/performance.md) · [Security](best-practices/security.md) |

