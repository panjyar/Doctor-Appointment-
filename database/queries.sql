-- Useful PostgreSQL queries for development / viva / testing

-- 1. See all doctors
SELECT * FROM doctors ORDER BY name;

-- 2. See all appointments with doctor names
SELECT
    a.id,
    a.patient_name,
    a.mobile_number,
    d.name AS doctor_name,
    d.specialty,
    a.appointment_date,
    a.appointment_time,
    a.reason_for_visit,
    a.ai_summary,
    a.status,
    a.created_at,
    a.updated_at
FROM appointments a
JOIN doctors d ON d.id = a.doctor_id
ORDER BY a.appointment_date, a.appointment_time;

-- 3. Example manual insert (replace doctor_id if needed)
INSERT INTO appointments (
    patient_name,
    mobile_number,
    doctor_id,
    appointment_date,
    appointment_time,
    reason_for_visit,
    ai_summary
)
VALUES (
    'Demo Patient',
    '9876543210',
    1,
    CURRENT_DATE + 1,
    '10:30',
    'Routine check-up and mild headache.',
    'Routine consultation requested for a mild headache and general check-up.'
);

-- 4. Mark an appointment Completed
UPDATE appointments
SET status = 'Completed', updated_at = NOW()
WHERE id = 1;

-- 5. Cancel an appointment
UPDATE appointments
SET status = 'Cancelled', updated_at = NOW()
WHERE id = 1;

-- 6. Delete an appointment
DELETE FROM appointments WHERE id = 1;

-- 7. Check whether a doctor/time slot already exists
SELECT EXISTS (
    SELECT 1
    FROM appointments
    WHERE doctor_id = 1
      AND appointment_date = CURRENT_DATE + 1
      AND appointment_time = '10:30'
) AS slot_taken;
