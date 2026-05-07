# MInT IMS - Plain React Frontend

## Overview
This is the **plain React** version (Create React App) of the MInT Internship Management System frontend.

## Differences from Next.js Version

| Feature | Next.js Version | Plain React Version |
|---------|----------------|---------------------|
| **Framework** | Next.js | Create React App |
| **Routing** | Built-in (App Router) | React Router DOM |
| **File Structure** | `app/` folder | `src/pages/` folder |
| **Server Rendering** | Yes | No (Client-side only) |
| **Build Folder** | `.next/` | `build/` |

## Installation

```bash
cd react-frontend
npm install
```

## Environment Setup

```bash
cp .env.example .env.local
```

Edit `.env.local` with your API URL.

## Development

```bash
npm start
```

Opens on [http://localhost:3000](http://localhost:3000)

## Build for Production

```bash
npm run build
```

Creates optimized production build in `build/` folder.

## Project Structure

```
react-frontend/
├── public/
│   └── index.html
├── src/
│   ├── components/        # Reusable components
│   ├── pages/            # Page components
│   │   ├── admin/
│   │   ├── university/
│   │   ├── supervisor/
│   │   └── student/
│   ├── services/         # API services
│   ├── store/            # State management
│   ├── types/            # TypeScript types
│   ├── hooks/            # Custom hooks
│   ├── utils/            # Utilities
│   ├── constants/        # Constants
│   ├── App.tsx           # Main app with routes
│   ├── index.tsx         # Entry point
│   └── index.css         # Global styles
├── package.json
└── tsconfig.json
```

## Key Features

- ✅ Plain React (no Next.js)
- ✅ React Router for navigation
- ✅ TypeScript
- ✅ Tailwind CSS
- ✅ Same components as Next.js version
- ✅ Same API services
- ✅ Same state management

## Technology Stack

- **React** 18.2
- **React Router DOM** 6.20
- **TypeScript** 5.0
- **Tailwind CSS** 3.4
- **Axios** for HTTP
- **Zustand** for state

## Getting Started

1. Install dependencies: `npm install`
2. Copy environment file: `cp .env.example .env.local`
3. Start development: `npm start`
4. Build for production: `npm run build`

## Notes

This is a **client-side only** React app. For server-side rendering and better SEO, use the Next.js version in the `frontend/` folder.
