# CareSlot — Mini Appointment Booking App

A complete Full Stack Developer practical assignment built with:

- **Frontend:** React + Vite + Tailwind CSS
- **Backend:** Node.js + Express
- **Database:** PostgreSQL using `pg` and raw SQL
- **AI bonus:** OpenAI Responses API for a short appointment summary

## Features

- Book an appointment with patient name, mobile number, doctor, date, time and reason for visit.
- Doctor dropdown loaded from PostgreSQL through the backend API.
- Prevents appointment dates in the past.
- Prevents the same doctor from being booked at the exact same date and time.
- Appointment statuses: `Scheduled`, `Completed`, `Cancelled`.
- Complete, cancel and delete actions.
- Responsive UI for desktop and mobile.
- Frontend and backend validation.
- Success/error toast messages.
- PostgreSQL persistence: data remains after refresh.
- **No-refresh updates:** create/status/delete API responses update React state immediately.
- Optional AI-generated visit summary, generated securely from the Node.js API.

## Project structure

```text
appointment-booking-app/
├── api/
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── routes/
│   │   ├── services/
│   │   └── utils/
│   ├── .env.example
│   ├── package.json
│   └── server.js
├── ui/
│   ├── src/
│   │   ├── components/
│   │   └── services/
│   ├── .env.example
│   ├── package.json
│   └── vite.config.js
├── database/
│   ├── schema.sql
│   └── queries.sql
└── README.md
```

## 1. Prerequisites

Install:

- Node.js 20+ (Node.js 22 is a good choice)
- npm
- PostgreSQL 14+

## 2. Create the PostgreSQL database

Open PostgreSQL/pgAdmin and create a database:

```sql
CREATE DATABASE appointment_booking;
```

Then run `database/schema.sql` against that database.

Using `psql`:

```bash
psql -U postgres -d appointment_booking -f database/schema.sql
```

The schema creates both `doctors` and `appointments` tables and inserts four sample doctors.

## 3. Configure and run the backend

```bash
cd api
npm install
```

Copy the environment file:

Windows PowerShell:

```powershell
Copy-Item .env.example .env
```

macOS/Linux:

```bash
cp .env.example .env
```

Edit `api/.env`:

```env
PORT=5000
DATABASE_URL=postgresql://postgres:YOUR_POSTGRES_PASSWORD@localhost:5432/appointment_booking
CORS_ORIGIN=http://localhost:5173
OPENAI_API_KEY=YOUR_OPENAI_API_KEY
OPENAI_MODEL=gpt-5
```

`OPENAI_API_KEY` is only required for the optional AI-summary feature. The rest of the app works without it.

Start the backend:

```bash
npm run dev
```

Backend URL: `http://localhost:5000`

Health check: `http://localhost:5000/api/health`

## 4. Configure and run the React frontend

Open a second terminal:

```bash
cd ui
npm install
```

Copy the environment file:

Windows PowerShell:

```powershell
Copy-Item .env.example .env
```

macOS/Linux:

```bash
cp .env.example .env
```

Default frontend environment:

```env
VITE_API_URL=http://localhost:5000/api
```

Start Vite:

```bash
npm run dev
```

Open `http://localhost:5173`.

## API endpoints

| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/api/health` | Backend health check |
| GET | `/api/doctors` | Load doctor dropdown |
| GET | `/api/appointments` | List appointments |
| POST | `/api/appointments` | Create appointment |
| PATCH | `/api/appointments/:id/status` | Complete/cancel appointment |
| DELETE | `/api/appointments/:id` | Delete appointment |
| POST | `/api/ai/summary` | Generate optional AI summary |

## Example create appointment body

```json
{
  "patient_name": "Rahul Kumar",
  "mobile_number": "9876543210",
  "doctor_id": 1,
  "appointment_date": "2026-09-14",
  "appointment_time": "10:30",
  "reason_for_visit": "Mild headache and routine check-up.",
  "ai_summary": "Patient requests a routine consultation for a mild headache."
}
```

## How the no-refresh behavior works

The app does **not** reload the browser after mutations:

- POST returns the created appointment → React adds it to `appointments` state.
- PATCH returns the updated appointment → React replaces that row in state.
- DELETE succeeds → React removes that row from state.

A normal browser refresh calls `GET /api/appointments`, so persisted PostgreSQL data appears again.

## Duplicate slot protection

There are two protection layers:

1. Backend validation and clear HTTP error handling.
2. PostgreSQL unique constraint:

```sql
CONSTRAINT unique_doctor_slot
UNIQUE (doctor_id, appointment_date, appointment_time)
```

If two requests reach the server at nearly the same moment, PostgreSQL still guarantees the same doctor cannot be booked twice for that exact slot.

## AI bonus feature

The browser never receives the OpenAI API key. The React UI sends only the reason for visit to:

```text
POST /api/ai/summary
```

The Node.js backend calls the OpenAI Responses API and returns a short non-diagnostic intake summary. If `OPENAI_API_KEY` is not configured, the endpoint returns a clear error and normal appointment booking still works.

## Production notes

For deployment you can use, for example:

- UI: Vercel / Netlify
- API: Render / Railway
- PostgreSQL: Neon / Supabase / Railway / Render PostgreSQL

Set the production `VITE_API_URL`, `DATABASE_URL`, `CORS_ORIGIN`, and (optionally) `OPENAI_API_KEY` in the respective hosting dashboards.

## Suggested GitHub submission checklist

- Push the entire repository.
- Do **not** commit `.env` files.
- Include screenshots in the README if you want extra polish.
- Verify create, complete, cancel and delete flows.
- Verify duplicate doctor/time booking returns an error.
- Verify refresh preserves data.
- Verify mobile responsive layout.
