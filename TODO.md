# TODO - Real Estate Showing & Verification App

- [x] Backend: Implement core models and AppDbContext.
- [x] Backend: Implement TokenService (SHA-256) and idempotent VerificationController.
- [x] Backend: Implement ShowingsController and AdminController.
- [x] Backend: Implement AnomalySweeperJob for background fraud detection.
- [x] Backend: Implement TelemetryController for outreach click tracking.
- [x] Backend: Add Health Check endpoint at `/health`.
- [x] Backend: Fix optimistic concurrency mapping for PostgreSQL using `xmin`.
- [x] Frontend: Configure Vite PWA and TailwindCSS.
- [x] Frontend: Implement BrokerApp with offline creation support.
- [x] Frontend: Implement ProspectView with verification and outreach.
- [x] Frontend: Implement AdminPortal with CSV parsing and stats dashboard.
- [x] Frontend: Implement offline synchronization from IndexedDB to API.
- [x] Infrastructure: Create multi-stage Dockerfile for backend.
- [x] Infrastructure: Create `render.yaml` for one-click deployment.
- [ ] Security: Implement full user registration and persistent JWT storage on frontend.
- [ ] UI: Replace 0-byte PWA placeholder icons with actual branded assets.
- [ ] Testing: Add comprehensive unit and integration tests for core logic.
- [ ] Validation: Implement FluentValidation for all incoming request DTOs.
