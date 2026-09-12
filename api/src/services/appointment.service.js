import { pool } from '../config/db.js';

const appointmentSelect = `
  SELECT
    a.id,
    a.patient_name,
    a.mobile_number,
    a.doctor_id,
    d.name AS doctor_name,
    d.specialty AS doctor_specialty,
    TO_CHAR(a.appointment_date, 'YYYY-MM-DD') AS appointment_date,
    TO_CHAR(a.appointment_time, 'HH24:MI') AS appointment_time,
    a.reason_for_visit,
    a.ai_summary,
    a.status,
    a.created_at,
    a.updated_at
  FROM appointments a
  JOIN doctors d ON d.id = a.doctor_id
`;

export async function getAllAppointments() {
  const { rows } = await pool.query(`${appointmentSelect}
    ORDER BY a.appointment_date ASC, a.appointment_time ASC, a.id ASC
  `);
  return rows;
}

export async function getAppointmentById(id) {
  const { rows } = await pool.query(`${appointmentSelect} WHERE a.id = $1`, [id]);
  return rows[0] ?? null;
}

export async function createAppointment(data) {
  const {
    patientName,
    mobileNumber,
    doctorId,
    appointmentDate,
    appointmentTime,
    reasonForVisit,
    aiSummary,
  } = data;

  const currentDateResult = await pool.query('SELECT CURRENT_DATE::text AS today');
  const today = currentDateResult.rows[0].today;
  if (appointmentDate < today) {
    const error = new Error('Appointment date cannot be in the past.');
    error.statusCode = 400;
    throw error;
  }

  const doctorResult = await pool.query('SELECT id FROM doctors WHERE id = $1', [doctorId]);
  if (doctorResult.rowCount === 0) {
    const error = new Error('Selected doctor does not exist.');
    error.statusCode = 400;
    throw error;
  }

  let insertResult;
  try {
    insertResult = await pool.query(
      `INSERT INTO appointments (
        patient_name,
        mobile_number,
        doctor_id,
        appointment_date,
        appointment_time,
        reason_for_visit,
        ai_summary
      ) VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING id`,
      [
        patientName,
        mobileNumber,
        doctorId,
        appointmentDate,
        appointmentTime,
        reasonForVisit,
        aiSummary,
      ],
    );
  } catch (error) {
    if (error.code === '23505' && error.constraint === 'unique_doctor_slot') {
      const conflict = new Error('This doctor already has an appointment at the selected date and time.');
      conflict.statusCode = 409;
      throw conflict;
    }
    throw error;
  }

  return getAppointmentById(insertResult.rows[0].id);
}

export async function updateAppointmentStatus(id, status) {
  const { rows } = await pool.query(
    `UPDATE appointments
     SET status = $1, updated_at = NOW()
     WHERE id = $2 AND status = 'Scheduled'
     RETURNING id`,
    [status, id],
  );

  if (rows.length === 0) {
    const existing = await pool.query('SELECT status FROM appointments WHERE id = $1', [id]);
    if (existing.rowCount === 0) {
      return null;
    }

    const error = new Error('Only scheduled appointments can be completed or cancelled.');
    error.statusCode = 409;
    throw error;
  }

  return getAppointmentById(rows[0].id);
}

export async function deleteAppointment(id) {
  const { rows } = await pool.query(
    'DELETE FROM appointments WHERE id = $1 RETURNING id',
    [id],
  );
  return rows[0] ?? null;
}
