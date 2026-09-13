import { useState, useMemo } from 'react';
import { todayString } from '../utils/date.js';

const initialForm = {
  patient_name: '',
  mobile_number: '',
  doctor_id: '',
  appointment_date: '',
  appointment_time: '',
  reason_for_visit: '',
  ai_summary: '',
};

export function useAppointmentForm(onSubmit, onGenerateSummary) {
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [generating, setGenerating] = useState(false);
  const minDate = useMemo(() => todayString(), []);

  const availableTimes = useMemo(() => {
    const times = [];
    for (let h = 0; h < 24; h++) {
      for (let m = 0; m < 60; m += 30) {
        const hour = h.toString().padStart(2, '0');
        const min = m.toString().padStart(2, '0');
        times.push(`${hour}:${min}`);
      }
    }

    if (form.appointment_date === minDate) {
      const now = new Date();
      const currentTimeString = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
      return times.filter((t) => t > currentTimeString);
    }

    return times;
  }, [form.appointment_date, minDate]);

  function updateField(event) {
    let { name, value } = event.target;

    if (name === 'mobile_number') {
      value = value.replace(/\D/g, '').slice(0, 10);
    }

    setForm((current) => {
      const nextForm = { ...current, [name]: value };
      if (name === 'reason_for_visit') nextForm.ai_summary = '';
      if (name === 'appointment_date') nextForm.appointment_time = '';
      return nextForm;
    });
    setErrors((current) => ({ ...current, [name]: undefined }));
  }

  function validate() {
    const nextErrors = {};
    const mobile = form.mobile_number.trim().replace(/[\s()-]/g, '');

    if (form.patient_name.trim().length < 2) {
      nextErrors.patient_name = 'Enter at least 2 characters.';
    }
    if (!/^\d{10}$/.test(mobile)) {
      nextErrors.mobile_number = 'Enter exactly 10 digits.';
    }
    if (!form.doctor_id) {
      nextErrors.doctor_id = 'Please select a doctor.';
    }
    if (!form.appointment_date) {
      nextErrors.appointment_date = 'Please select a date.';
    } else if (form.appointment_date < minDate) {
      nextErrors.appointment_date = 'Past dates are not allowed.';
    }
    if (!form.appointment_time) {
      nextErrors.appointment_time = 'Please select a time.';
    } else if (!form.appointment_time.endsWith(':00') && !form.appointment_time.endsWith(':30')) {
      nextErrors.appointment_time = 'Time must be in 30-minute intervals.';
    }
    if (form.reason_for_visit.trim().length < 5) {
      nextErrors.reason_for_visit = 'Enter at least 5 characters.';
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  }

  async function handleSummary() {
    if (form.reason_for_visit.trim().length < 5) {
      setErrors((current) => ({
        ...current,
        reason_for_visit: 'Enter at least 5 characters before generating a summary.',
      }));
      return;
    }

    setGenerating(true);
    try {
      const summary = await onGenerateSummary(form.reason_for_visit.trim());
      setForm((current) => ({ ...current, ai_summary: summary }));
    } catch {
      // The parent already shows a user-friendly toast for API errors.
    } finally {
      setGenerating(false);
    }
  }

  async function handleSubmit(event) {
    event.preventDefault();
    if (!validate()) return;

    const success = await onSubmit({
      ...form,
      patient_name: form.patient_name.trim(),
      mobile_number: form.mobile_number.trim(),
      doctor_id: Number(form.doctor_id),
      reason_for_visit: form.reason_for_visit.trim(),
      ai_summary: form.ai_summary.trim() || null,
    });

    if (success) {
      setForm(initialForm);
      setErrors({});
    }
  }

  const inputClass = (name) =>
    `mt-1 w-full rounded-md border bg-white px-3 py-2 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:ring-2 focus:ring-offset-1 ${errors[name]
      ? 'border-rose-300 focus:border-rose-400 focus:ring-rose-100'
      : 'border-slate-200 focus:border-slate-400 focus:ring-slate-100'
    }`;

  return {
    form,
    errors,
    generating,
    minDate,
    availableTimes,
    updateField,
    handleSummary,
    handleSubmit,
    inputClass,
  };
}
