-- Mini Appointment Booking App
-- PostgreSQL schema

CREATE TABLE IF NOT EXISTS doctors (
    id SERIAL PRIMARY KEY,
    name VARCHAR(120) NOT NULL UNIQUE,
    specialty VARCHAR(120) NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS appointments (
    id BIGSERIAL PRIMARY KEY,
    patient_name VARCHAR(120) NOT NULL,
    mobile_number VARCHAR(20) NOT NULL,
    doctor_id INTEGER NOT NULL REFERENCES doctors(id) ON DELETE RESTRICT,
    appointment_date DATE NOT NULL,
    appointment_time TIME NOT NULL,
    reason_for_visit VARCHAR(500) NOT NULL,
    ai_summary TEXT,
    status VARCHAR(20) NOT NULL DEFAULT 'Scheduled'
        CHECK (status IN ('Scheduled', 'Completed', 'Cancelled')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT unique_doctor_slot UNIQUE (doctor_id, appointment_date, appointment_time)
);

CREATE INDEX IF NOT EXISTS idx_appointments_date
    ON appointments (appointment_date, appointment_time);

CREATE INDEX IF NOT EXISTS idx_appointments_status
    ON appointments (status);

INSERT INTO doctors (name, specialty)
VALUES
    ('Dr. Ananya Sharma', 'General Medicine'),
    ('Dr. Rahul Mehta', 'Cardiology'),
    ('Dr. Priya Nair', 'Dermatology'),
    ('Dr. Arjun Verma', 'Orthopedics')
ON CONFLICT (name) DO NOTHING;
