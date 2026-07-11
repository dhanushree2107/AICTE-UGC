# AICTE UG Approval Management System

A production-ready academic governance and approval management system designed using a modern microservice architecture, Keycloak enterprise SSO, Redis caching, and a Python FastAPI AI Agent core.

---

## Technical Stack

- **Frontend:** Angular 20, Angular Material components, CSS3 themes (Light/Dark mode)
- **Backend Services:** Java 25 + Spring Boot 4.x, Spring Cloud Gateway, Eureka Registry, Spring Security
- **Database:** PostgreSQL (Core system store)
- **Caching:** Redis (AI pipeline caching & lookup endpoints)
- **SSO Authentication:** Keycloak (OIDC OAuth2, standard flows, JWT tokens)
- **AI Agents:** Python FastAPI + Pydantic
- **DevOps:** Docker Compose, Kubernetes manifests, GitHub Actions CI/CD, Prometheus scraping

---

## Directory Structure

```
aicte-ug/
├── backend/                  # Spring Boot 4 / Java 25 microservices
│   ├── pom.xml               # Parent maven POM
│   ├── common/               # Shared security, errors & DTO configurations
│   ├── registry-service/     # Eureka server
│   ├── gateway-service/      # Routing & global CORS setup
│   ├── user-service/         # Keycloak profile syncing & user roles
│   ├── institute-service/    # Approved catalogs, departments, faculty profiles
│   ├── application-service/  # Intake submissions, status changes & tracking
│   ├── document-service/     # Multipart uploads & file storage mappings
│   ├── inspection-service/   # Peer scheduling and visit report submittals
│   ├── approval-service/     # Regional board vote and decision records
│   ├── notification-service/ # Bulletins, alerts & websocket notification loops
│   └── ai-integration-service/ # Redis-cached AI pipeline proxy
├── ai-service/               # FastAPI AI Service implementing 6 Agents
├── frontend/                 # Standalone Angular 20 SPA Portal code
├── keycloak/                 # Realm configurations (OIDC clients, client secret)
├── database/                 # Schema tables DDL and seed scripts
├── devops/                   # Prometheus configurations
├── kubernetes/               # Kubernetes Deployment YAML specifications
└── docker-compose.yml        # Multi-container local orchestration script
```

---

## Getting Started

### Prerequisites
- Docker & Docker Compose
- Maven 3.9+ & Java 21/25 (for local compilation)
- Node.js 18+ (for local frontend serving)

### Setup & Local Execution

1. **Start Infrastructure & Backend Services:**
   ```bash
   # Run all database, SSO, cache, python agents, and routing gateways
   docker-compose up --build -d
   ```

2. **Access Keycloak Realms:**
   - URL: `http://localhost:8080`
   - Admin Username: `admin` | Password: `admin`
   - Configured Realm: `aicte-realm`
   - Pre-seeded Test Accounts:
     - **Super Admin:** `superadmin` / `password`
     - **AICTE Board Admin:** `aicteadmin` / `password`
     - **College Administrator:** `collegeadmin` / `password`
     - **Peer Reviewer:** `reviewer` / `password`

3. **Explore REST API Documentation:**
   - Swagger / OpenAPI specifications are consolidated at the API Gateway:
     - `http://localhost:8060/swagger-ui.html`

4. **Access the Frontend Portal:**
   - Open `http://localhost:4200` to view the modern landing page.
   - Use the bottom-right AI Helpdesk Assistant bubble for interactive Q&A.
   - Switch color themes (Light/Dark) in the header menu.
   - Log in to experience customized boards (College console, document upload, review panel, EVC scheduling).
