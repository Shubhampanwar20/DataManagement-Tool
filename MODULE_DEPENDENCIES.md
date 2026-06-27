# AuditOS Module Dependencies

## Core Dependency Model
AuditOS is designed as a layered system. The core audit workflow depends on a shared foundation and a set of specialized modules.

## Foundation Layer
Modules that provide shared capabilities:
- App shell and routing
- Theme and notification providers
- Dexie storage layer
- Shared UI primitives
- Common domain types

## Core Workflow Layer
Modules that power the main audit lifecycle:
- Client management
- Engagement management
- Excel import engine
- Data Request Tracker
- Process and workstream management

## Intelligence Layer
Modules that enrich the audit workflow:
- Document suggestion engine
- Risk and control library
- Testing procedure guidance
- Sample guidance engine
- Observation management
- Working paper generation
- Reporting engine

## Dependency Relationships

### Client Management
Depends on:
- foundation layer
- engagement management

### Engagement Management
Depends on:
- client management
- storage layer
- process management

### Excel Import Engine
Depends on:
- storage layer
- engagement management
- shared domain types

### Data Request Tracker
Depends on:
- engagement management
- excel import engine
- process management
- storage layer

### Process Management
Depends on:
- engagement management
- request tracker
- industry rule libraries

### Document Suggestions
Depends on:
- data requests
- process management
- engagement context

### Risk and Control Guidance
Depends on:
- process management
- engagement management
- industry rule libraries

### Testing and Sample Guidance
Depends on:
- process management
- request tracker
- risk and control context

### Observations and Working Papers
Depends on:
- request tracker
- testing guidance
- sample guidance
- engagement context

### Reporting
Depends on:
- all prior modules
- storage layer

## Industry-Aware Design
Each industry-specific module should be implemented as a plug-in or rule pack rather than a hard-coded branch in the main workflow. This keeps the shared core stable while allowing process, control, and sample guidance to vary by industry.

## Dependency Rule
No downstream module should bypass the core workflow. Every request, observation, document, and report should trace back to an engagement and its linked processes.
