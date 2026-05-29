<div align="center">

# FORMFORGE AI

### Metadata-Driven Application Runtime Platform

Turn JSON configurations into fully functional applications with dynamic UI rendering, runtime validation, auto-generated APIs, and scalable full-stack architecture.

<br/>

![Next.js](https://img.shields.io/badge/Next.js-15-black?style=for-the-badge\&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge\&logo=typescript\&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-4169E1?style=for-the-badge\&logo=postgresql\&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-2D3748?style=for-the-badge\&logo=prisma)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-06B6D4?style=for-the-badge\&logo=tailwindcss\&logoColor=white)

</div>

---

# Overview

FormForge AI is a production-grade metadata-driven application builder that dynamically generates forms, dashboards, tables, APIs, and workflows directly from JSON configuration.

The platform focuses heavily on:

* runtime reliability
* dynamic rendering systems
* scalable frontend/backend architecture
* graceful error recovery
* validation-first engineering

Unlike traditional static admin panels, FormForge AI uses a runtime component registry system to interpret and render UI dynamically without hardcoded page structures.

---

# Core Features

## Dynamic Runtime Rendering

* JSON-driven UI generation
* Dynamic form rendering
* Metadata-powered dashboards
* Configurable layouts
* Reusable component registry system

## Validation-First Architecture

* Runtime schema validation using Zod
* Defensive rendering strategies
* Graceful fallback components
* Error boundaries across critical flows
* Unknown component recovery system

## Dynamic CRUD API System

* Auto-generated API architecture
* Typed request/response handling
* Validation-aware backend execution
* User-scoped resource management

## Enterprise Dashboard System

* Runtime analytics
* API monitoring
* Activity timelines
* Validation tracking
* Operational metrics

## Advanced App Builder

* Live JSON editor
* Real-time UI preview
* Responsive runtime rendering
* Dynamic component resolution
* Mobile/tablet/desktop preview modes

## CSV Import Engine

* Drag-and-drop uploads
* Validation reporting
* Record preview system
* Field mapping workflows
* Duplicate handling

## API Explorer

* Endpoint testing
* Request builder
* JSON response viewer
* Runtime API inspection

## Error Monitoring

* Runtime error logging
* Schema diagnostics
* Validation tracking
* API failure reporting
* Structured operational monitoring

## Authentication System

* Protected routes
* Persistent sessions
* Secure user access
* Scalable auth architecture

---

# Runtime Architecture

## Metadata-Driven Rendering Engine

The platform dynamically resolves UI components through a centralized runtime registry.

Example runtime configuration:

```json
{
  "page": "Student Form",
  "layout": "grid",
  "components": [
    {
      "type": "input",
      "label": "Name",
      "required": true
    },
    {
      "type": "email",
      "label": "Email"
    }
  ]
}
```

The renderer interprets configuration at runtime and generates the application interface dynamically.

---

# Tech Stack

## Frontend

* Next.js App Router
* React
* TypeScript
* TailwindCSS
* Framer Motion
* Zustand

## Backend

* Next.js API Routes
* Prisma ORM
* PostgreSQL
* Zod Validation

## Infrastructure

* Vercel
* Neon PostgreSQL

---

# Engineering Priorities

The system was intentionally designed around:

* clean architecture
* runtime resilience
* defensive rendering
* scalable component systems
* extensibility
* structured validation
* graceful degradation

The focus was placed on engineering quality and reliability over excessive visual complexity.

---

# Folder Structure

```txt
src/
 ├── app/
 ├── components/
 │    ├── builder/
 │    ├── charts/
 │    ├── fallback/
 │    ├── forms/
 │    ├── tables/
 │    └── ui/
 ├── hooks/
 ├── lib/
 │    ├── api/
 │    ├── runtime/
 │    ├── utils/
 │    └── validators/
 ├── services/
 ├── store/
 ├── types/
 └── prisma/
```

---

# Installation

## Clone Repository

```bash
git clone https://github.com/maryamnibras157/formforge-ai.git
```

## Navigate Into Project

```bash
cd formforge-ai
```

## Install Dependencies

```bash
npm install
```

## Setup Environment Variables

Create a `.env` file:

```env
DATABASE_URL=
NEXTAUTH_SECRET=
NEXTAUTH_URL=
```

## Start Development Server

```bash
npm run dev
```

---

# Future Scope

* AI-assisted config repair
* Workflow automation engine
* Multi-user collaboration
* Realtime synchronization
* Visual drag-and-drop builder
* Marketplace publishing system

---

# Author

### Maryam Nibras

GitHub:
https://github.com/maryamnibras157

---
