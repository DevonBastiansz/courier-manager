# Courier Service App - Guide

## INSTRUCTIONS

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

---

## Features

### 1. Authentication & Authorization
- Register new user accounts (client and admin roles available)
- Login redirects to appropriate dashboard based on role
- Protected routes require authentication
- Logout clears session and redirects properly

### 2. Client Features
- Create new shipments with recipient details
- View only personal shipments on dashboard
- Shipments display with color-coded status badges (Pending/In Transit/Delivered)
- Sender information auto-fills from user profile

### 3. Admin Features
- Admin dashboard shows all shipments across the system
- Update shipment status using inline dropdown (auto-saves)
- View client information for each shipment
- Status changes reflect in real-time

### 4. Public Tracking
- Track shipments using tracking number (format: TRK-XXXXXXXX)
- Visual progress timeline shows current status
- Displays sender/recipient details and shipment information

### 5. Error Handling
- Login with incorrect credentials shows appropriate error messages
- Invalid tracking numbers display clear error feedback
- Network errors handled gracefully


## API Endpoints

Test backend directly at `http://localhost:5000/api`:

**Authentication:**
- `POST /auth/register` - Create account
- `POST /auth/login` - User login

**Shipments:**
- `GET /shipments/:trackingNumber` - Public tracking
- `POST /shipments` - Create shipment (requires auth)
- `GET /shipments` - List shipments (requires auth, role-based)
- `PUT /shipments/:id` - Update status (admin only)

---

## See README.md for more details (Features, Tech Stack, Prerequisites and Project Structure)