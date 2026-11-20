# Corporate IT Knowledge Hub — cahier des charges

> Spécification reçue du propriétaire le 2026-11-20. Élément de feuille de route
> du projet itknowledge.ma — non implémenté dans le site vitrine actuel.
> **Décision du propriétaire (2026-11-20) : mis en pause.** À reprendre après le
> déploiement du site. Socle choisi d'avance : développement sur mesure API-first
> en Go (SQLite/Postgres + UI web + endpoint MCP), par étapes — modèle de contenu
> et authentification d'abord, gouvernance ensuite.

## Objective

Build a modern, scalable IT Knowledge Hub that serves as the central source of truth for corporate technical knowledge, engineering practices, operational procedures, and continuous learning.

The platform must support both human users and AI agents.

## Knowledge taxonomy

Organize the platform around the following primary sections:

1. IT Infrastructure
2. Networking & Connectivity
3. Cybersecurity
4. Cloud & DevOps
5. Software Engineering
6. AI & Agentic Engineering
7. Automation & Integration
8. IT Operations & Service Management
9. Monitoring & Observability
10. Troubleshooting & Known Issues
11. IT Governance & Compliance
12. Projects & Architecture
13. Learning Center
14. Tools & Resources

Each section must support nested categories, articles, tags, and related content. Categories must be dynamically manageable rather than hardcoded.

## Content types

Support technical documentation, tutorials, SOPs, operational runbooks, architecture decision records, troubleshooting guides, RCA reports, postmortems, policies, best practices, and reusable scripts.

## User experience

- Modern, professional, documentation-first design.
- Collapsible hierarchical sidebar.
- Global search with keyboard shortcuts.
- Light and dark modes.
- Responsive desktop and mobile layouts.
- Article table of contents.
- Syntax-highlighted code blocks with copy functionality.
- Mermaid diagram rendering.
- Recently updated and popular articles.
- Bookmarks and related documentation.

## Content management and governance

Implement article ownership, role-based access control, document classification, approval workflows, version history, review schedules, and audit trails.

Every article must contain an owner, status, category, tags, creation date, modification date, and next review date.

## AI readiness

Design the knowledge architecture to support future semantic search, RAG, AI-powered question answering with citations, and knowledge consumption through APIs and MCP.

AI access must respect the same authorization and document classification rules as human access.

## Architecture principles

- Modular and extensible architecture.
- API-first design.
- Secure by default.
- Separation of content, presentation, and business logic.
- Centralized authentication and authorization.
- Reusable UI components.
- Comprehensive observability.

The platform should evolve into a corporate technical knowledge ecosystem, not simply a collection of static documentation pages.

Do not hardcode the knowledge taxonomy or assume all content is accessible to every user.
