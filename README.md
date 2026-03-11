# Real Estate Showing & Verification App

This repository contains the React PWA frontend and C# .NET Web API backend for the Real Estate Showing app.

## Deploy to Render

Click the button below to automatically provision the PostgreSQL database, deploy the .NET Web API, and build/deploy the React PWA as a static site via Render's Infrastructure-as-Code (IaC) blueprint.

[![Deploy to Render](https://render.com/images/deploy-to-render-button.svg)](https://render.com/deploy?repo=https://github.com/ShmuelCammebys/RenderSample)

## Tech Stack

- **Frontend:** React 18, TypeScript, Vite, TailwindCSS, Vite PWA (Workbox)
- **Backend:** .NET 8 ASP.NET Core Web API, Entity Framework Core
- **Database:** PostgreSQL
- **Infrastructure:** Render (Static Site, Web Service, Managed Database)

## Key Features

- **Broker PWA:** Mobile-first, offline support via IndexedDB and Service Worker caching.
- **Prospect Verification:** Lightweight view for visit confirmation with idempotent verification.
- **Outreach Telemetry:** Tracks prospect outreach clicks for advocacy.
- **Admin Dashboard:** Stats visualization and CSV upload for eligible units.
- **Fraud Detection:** Background job to detect and flag suspicious verification patterns.

## Getting Started

### Backend
1. `cd backend/RealEstateApi`
2. `dotnet restore`
3. `dotnet build`
4. Set up a PostgreSQL database and update `ConnectionStrings:DefaultConnection`.
5. `dotnet run`

### Frontend
1. `cd frontend`
2. `npm install`
3. `npm run dev`
