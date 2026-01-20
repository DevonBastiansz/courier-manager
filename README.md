# Courier Manager - Shipment Tracking System

A full-stack courier service application built with the MERN stack (MongoDB, Express, React, Node.js) and TypeScript. This application enables users to create and track shipments, while administrators can manage all shipments and update their status.

### Please scroll down to see instructions to run the application or go to QUICKSTART.md.

## Features

### User Features
- Authentication: Secure registration and login with JWT tokens
- Dashboard: View all personal shipments with color-coded status badges
- Create Shipment: Simple form with three fields (recipient name, address, and shipment details)
  - Auto-Fill Sender Info: Sender name and address are automatically pulled from your user profile
  - No need to re-enter your information for every shipment
- Track Shipment: Shipment tracking page with progress timeline showing shipment status

### Admin Features
- Admin Dashboard: Clearly labeled dashboard to view all shipments across the entire system
- Inline Status Management: Update shipment status using dropdown directly in the table
  - Auto-Save: Status changes save automatically without additional buttons
  - Visual Feedback: Loading indicator shows when update is in progress
- Client Information: See which user created each shipment with their contact details

### Technical Features
- Role-Based Access Control: Separate permissions for users and admins
- Automatic Tracking Numbers: System-generated unique tracking IDs (TRK-XXXXXXXX format)
- Responsive Design: Modern UI with Tailwind CSS, optimized for all devices
- Real-Time Updates: Status changes reflect instantly across the application
- Smart Data Entry: Reduces user input by automatically filling sender information

## Tech Stack

### Backend
- Node.js with Express - RESTful API server
- MongoDB with Mongoose - NoSQL database
- TypeScript - Type-safe backend logic
- JWT - Token-based authentication
- bcryptjs - Password hashing

### Frontend
- React 18 with TypeScript - Component-based UI
- Vite - Fast build tool and dev server
- React Router - Client-side routing
- Axios - HTTP client with interceptors
- Tailwind CSS - Utility-first styling

# Prerequisites

Before running this application, ensure you have the following installed:

- Node.js (v16 or higher) - [Download](https://nodejs.org/)
- MongoDB (v5 or higher) - [Download](https://www.mongodb.com/try/download/community)
- npm - Comes with Node.js

## Project Structure

```
Bconic Project/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   └── database.ts          # MongoDB connection
│   │   ├── middleware/
│   │   │   └── auth.ts               # JWT verification & role checking
│   │   ├── models/
│   │   │   ├── User.ts               # User schema
│   │   │   └── Shipment.ts           # Shipment schema
│   │   ├── routes/
│   │   │   ├── auth.ts               # Authentication routes
│   │   │   └── shipments.ts          # Shipment CRUD routes
│   │   ├── types/
│   │   │   └── index.ts              # TypeScript type definitions
│   │   ├── utils/
│   │   │   └── trackingNumber.ts     # Tracking number generator
│   │   └── index.ts                  # Express server entry
│   ├── package.json
│   └── tsconfig.json
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   └── Navigation.tsx        # Header navigation
│   │   ├── context/
│   │   │   └── AuthContext.tsx       # Authentication state
│   │   ├── pages/
│   │   │   ├── Login.tsx             # Login page
│   │   │   ├── Register.tsx          # Registration page
│   │   │   ├── Dashboard.tsx         # User dashboard
│   │   │   ├── AdminDashboard.tsx    # Admin dashboard
│   │   │   ├── Track.tsx             # Public tracking page
│   │   │   └── index.ts              # Page exports
│   │   ├── utils/
│   │   │   └── api.ts                # Axios configuration
│   │   ├── App.tsx                   # Main app component
│   │   ├── main.tsx                  # React entry point
│   │   └── index.css                 # Tailwind CSS imports
│   ├── index.html
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   ├── vite.config.ts
│   ├── package.json
│   └── tsconfig.json
│
├── package.json                      # Root workspace config
├── README.md                         # This file
└── UserStories.md                    # Next iteration features
```

## INSTRUCTIONS TO RUN THE APPLICATION

### 1. Install Dependencies
From the project root directory, run:
```bash
npm install
```

This installs dependencies for both backend and frontend using npm workspaces.

### 2. Start MongoDB
Make sure MongoDB is running locally on port 27017.

**Note**: Environment files (`.env`) are optional for local development. The app uses defaults (MongoDB on localhost:27017, backend on port 5000).

## Running the Application

### From the project root directory:

**Run both backend and frontend together:**
```bash
npm run dev
```

This starts:
- **Backend** on `http://localhost:5000`
- **Frontend** on `http://localhost:5173`

## Access the Application

Once running, open your browser:
- **Frontend (to test the UI)**: http://localhost:5173
- **API**: http://localhost:5000/api

## Routes

### Public
- `/login` - User login
- `/register` - Create account
- `/track` - Track shipment (no login required)

### Authenticated
- `/dashboard` - Your shipments (clients)
- `/admin` - All shipments (admins only)

## Testing the Application

Simply register new accounts at `/register`:
- Client accounts are created by default
- To test admin features, you can create an admin account during registration