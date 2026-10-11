# Nomad Navigator

A modern travel booking frontend built with React, Vite, and Tailwind CSS. The app provides a polished user experience for browsing travel offers, exploring trip suggestions, and managing a travel booking workflow.

## Overview

Nomad Navigator is the frontend layer of a travel booking platform. It is designed to work with a backend microservices architecture and gives users a clean interface for searching and exploring travel services such as flights and hotels.

## Features

- Hotel and flight listing views
- Responsive and modern UI design
- User authentication flows
- Role-aware interface patterns
- AI-powered travel route generation
- Profile and account area
- Clean booking-oriented dashboard experience

## Tech Stack

- React
- TypeScript
- Vite
- Tailwind CSS
- shadcn/ui
- Firebase Authentication
- Framer Motion
- React Router DOM
- Recharts

## Architecture

```text
Frontend App
    |
    +--> Authentication
    +--> Dashboard / Booking Views
    +--> Hotel and Flight Listings
    +--> AI Route Planner
    +--> User Profile
    `--> API Integration Layer
            |
            v
    Travel Booking Backend
    (Spring Boot Microservices + API Gateway)
```

## Related Backend

This frontend is designed to connect to the backend project:

https://github.com/Oussamoux1234/TravelBookingSystem

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Firebase project (for auth)
- A running backend instance

### 1. Clone the repository

```bash
git clone https://github.com/Oussamoux1234/TravelBookingSystem_FrontEnd.git
cd TravelBookingSystem_FrontEnd
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Create a `.env.local` file based on the project configuration.

Example:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=your-key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=your-app-id

GOOGLE_GENAI_API_KEY=your-ai-key
NEXT_PUBLIC_API_BASE_URL=http://localhost:8080
```

### 4. Run the app

```bash
npm run dev
```

Then open the local app in the browser using the Vite local URL.

## Scripts

```bash
npm run dev
npm run build
npm run preview
npm run lint
npm run typecheck
npm run ai-server
```

## Project Structure

```text
TravelBookingSystem_FrontEnd/
├── src/
│   ├── ai/
│   ├── components/
│   ├── lib/
│   ├── pages/
│   ├── App.tsx
│   └── main.tsx
├── public/
├── docs/
├── .gitignore
├── apphosting.yaml
├── components.json
├── env.example
├── index.html
├── package.json
├── postcss.config.mjs
├── tailwind.config.ts
├── tsconfig.json
├── tsconfig.node.json
├── vite.config.ts
└── README.md
```

## App Features

### Authentication
- Email/password login
- Google sign-in
- Firebase-backed authentication flow

### Travel browsing
- Hotel cards and listings
- Flight options and search-focused UI
- Responsive presentation of travel data

### AI assistant
- Route planning support using AI-generated suggestions
- Travel recommendation logic integrated into the frontend workflow

### UI/UX
- Clean modern interface
- Tailwind styling
- Motion and transitions for better usability

## Backend Integration

The frontend is built to communicate with the backend gateway and service ecosystem. The app uses environment variables and an API base URL to connect to the backend services.

Example:

```text
NEXT_PUBLIC_API_BASE_URL=http://localhost:8080
```

## Notes

This project is intended as a modern frontend layer for a microservices-based travel booking system. It is ready for extension with advanced filtering, styled booking steps, payment flows, and richer user dashboards.

## License

This project does not currently declare an explicit license. Add a `LICENSE` file before public distribution or commercial use.

## Contributors

- Oussamoux1234

---

This README provides a simple yet clear introduction for developers, contributors, and reviewers exploring the frontend and its connection to the backend travel booking system.
