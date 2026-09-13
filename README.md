# Appointment Booking App

A simple appointment booking application.

## Tech Stack Used

- **Frontend:** React, Vite, Tailwind CSS
- **Backend:** Node.js, Express
- **Database:** PostgreSQL
- **AI Integration:** Gemini API (for generating appointment summaries)

## How to Run

### 1. Prerequisites
- Node.js (v20+ recommended)
- PostgreSQL (v14+ recommended)

### 2. Database Setup
1. Create a PostgreSQL database named `appointment_booking`:
   ```sql
   CREATE DATABASE appointment_booking;
   ```
2. Run the provided schema file to create the tables and insert sample data:
   ```bash
   psql -U postgres -d appointment_booking -f database/schema.sql
   ```

### 3. Backend Setup
1. Navigate to the `api` directory:
   ```bash
   cd api
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up environment variables:
   Create an `.env` file in the `api` directory and update the `DATABASE_URL` and `GEMINI_API_KEY` (optional).
   ```env
   PORT=5000
   DATABASE_URL=postgresql://postgres:password@localhost:5432/appointment_booking
   CORS_ORIGIN=http://localhost:5173
   GEMINI_API_KEY=your_gemini_api_key_here
   GEMINI_MODEL=gemini-1.5-flash
   ```
4. Start the backend server:
   ```bash
   npm run dev
   ```

### 4. Frontend Setup
1. Open a new terminal and navigate to the `ui` directory:
   ```bash
   cd ui
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up environment variables:
   Create an `.env` file in the `ui` directory:
   ```env
   VITE_API_URL=http://localhost:5000/api
   ```
4. Start the frontend development server:
   ```bash
   npm run dev
   ```
