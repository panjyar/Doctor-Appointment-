const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;
const TIME_PATTERN = /^([01]\d|2[0-3]):[0-5]\d$/;
const MOBILE_PATTERN = /^\+?\d{7,15}$/;

export function normalizeMobile(value = '') {
  return String(value).trim().replace(/[\s()-]/g, '');
}

export function validateAppointmentInput(body) {
  const errors = [];
  const patientName = String(body.patient_name ?? '').trim();
  const mobileNumber = normalizeMobile(body.mobile_number);
  const doctorId = Number(body.doctor_id);
  const appointmentDate = String(body.appointment_date ?? '').trim();
  const appointmentTime = String(body.appointment_time ?? '').trim();
  const reasonForVisit = String(body.reason_for_visit ?? '').trim();
  const aiSummary = body.ai_summary ? String(body.ai_summary).trim() : null;

  if (patientName.length < 2 || patientName.length > 120) {
    errors.push('Patient name must be between 2 and 120 characters.');
  }

  if (!MOBILE_PATTERN.test(mobileNumber)) {
    errors.push('Mobile number must contain 7 to 15 digits and may start with +.');
  }

  if (!Number.isInteger(doctorId) || doctorId <= 0) {
    errors.push('Please select a valid doctor.');
  }

  if (!DATE_PATTERN.test(appointmentDate)) {
    errors.push('Appointment date must use YYYY-MM-DD format.');
  }

  if (!TIME_PATTERN.test(appointmentTime)) {
    errors.push('Appointment time must use HH:MM format.');
  }

  if (reasonForVisit.length < 5 || reasonForVisit.length > 500) {
    errors.push('Reason for visit must be between 5 and 500 characters.');
  }

  if (aiSummary && aiSummary.length > 1000) {
    errors.push('AI summary is too long.');
  }

  return {
    errors,
    data: {
      patientName,
      mobileNumber,
      doctorId,
      appointmentDate,
      appointmentTime,
      reasonForVisit,
      aiSummary,
    },
  };
}

export function isAllowedStatus(status) {
  return status === 'Completed' || status === 'Cancelled';
}
