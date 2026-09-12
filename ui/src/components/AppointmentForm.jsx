import { useMemo, useState } from 'react';
import { CalendarPlus, Sparkles } from 'lucide-react';

const initialForm = {
  patient_name: '',
  mobile_number: '',
  doctor_id: '',
  appointment_date: '',
  appointment_time: '',
  reason_for_visit: '',
  ai_summary: '',
};

function todayString() {
  const now = new Date();
  const offset = now.getTimezoneOffset();
  return new Date(now.getTime() - offset * 60_000).toISOString().slice(0, 10);
}

export default function AppointmentForm({ doctors, onSubmit, onGenerateSummary, submitting }) {
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
    `mt-1 w-full rounded-md border bg-white px-3 py-2 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:ring-2 focus:ring-offset-1 ${
      errors[name]
        ? 'border-rose-300 focus:border-rose-400 focus:ring-rose-100'
        : 'border-slate-200 focus:border-slate-400 focus:ring-slate-100'
    }`;

  return (
    <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
      <div className="mb-4 flex items-start gap-3">
        <div className="rounded-lg bg-sky-50 p-2 text-sky-600">
          <CalendarPlus className="size-5" />
        </div>
        <div>
          <h2 className="text-lg font-bold text-slate-900">Book an appointment</h2>
          <p className="mt-0.5 text-xs text-slate-500">Fill in the patient and appointment details.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-3" noValidate>
        <div className="grid gap-3 sm:grid-cols-2">
          <label className="text-xs font-semibold text-slate-700">
            Patient name
            <input
              className={inputClass('patient_name')}
              name="patient_name"
              value={form.patient_name}
              onChange={updateField}
              placeholder="e.g. Rahul Kumar"
              maxLength={120}
            />
            {errors.patient_name && <span className="mt-1 block text-xs text-rose-600">{errors.patient_name}</span>}
          </label>

          <label className="text-xs font-semibold text-slate-700">
            Mobile number
            <input
              className={inputClass('mobile_number')}
              name="mobile_number"
              type="tel"
              value={form.mobile_number}
              onChange={updateField}
              placeholder="e.g. 9876543210"
              maxLength={10}
            />
            {errors.mobile_number && <span className="mt-1 block text-xs text-rose-600">{errors.mobile_number}</span>}
          </label>
        </div>

        <label className="block text-xs font-semibold text-slate-700">
          Doctor
          <select
            className={inputClass('doctor_id')}
            name="doctor_id"
            value={form.doctor_id}
            onChange={updateField}
          >
            <option value="">Select a doctor</option>
            {doctors.map((doctor) => (
              <option key={doctor.id} value={doctor.id}>
                {doctor.name} — {doctor.specialty}
              </option>
            ))}
          </select>
          {errors.doctor_id && <span className="mt-1 block text-xs text-rose-600">{errors.doctor_id}</span>}
        </label>

        <div className="grid gap-3 sm:grid-cols-2">
          <label className="text-xs font-semibold text-slate-700">
            Appointment date
            <input
              className={inputClass('appointment_date')}
              name="appointment_date"
              type="date"
              min={minDate}
              value={form.appointment_date}
              onChange={updateField}
            />
            {errors.appointment_date && <span className="mt-1 block text-xs text-rose-600">{errors.appointment_date}</span>}
          </label>

          <label className="text-xs font-semibold text-slate-700">
            Appointment time
            <select
              className={inputClass('appointment_time')}
              name="appointment_time"
              value={form.appointment_time}
              onChange={updateField}
            >
              <option value="">Select a time</option>
              {availableTimes.map((time) => (
                <option key={time} value={time}>
                  {time}
                </option>
              ))}
            </select>
            {errors.appointment_time && <span className="mt-1 block text-xs text-rose-600">{errors.appointment_time}</span>}
          </label>
        </div>

        <label className="block text-xs font-semibold text-slate-700">
          Reason for visit
          <textarea
            className={`${inputClass('reason_for_visit')} min-h-20 resize-y`}
            name="reason_for_visit"
            value={form.reason_for_visit}
            onChange={updateField}
            placeholder="Briefly describe why the patient is visiting..."
            maxLength={500}
          />
          <div className="mt-1 flex items-center justify-between gap-3">
            <span className="text-xs text-rose-600">{errors.reason_for_visit}</span>
            <span className="text-xs font-medium text-slate-400">{form.reason_for_visit.length}/500</span>
          </div>
        </label>

        <div className="rounded-lg border border-violet-100 bg-violet-50/60 p-3">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="flex items-center gap-2 text-sm font-bold text-violet-900">
                <Sparkles className="size-4" /> AI appointment summary
              </p>
              <p className="mt-0.5 text-xs text-violet-700/80">Optional bonus feature. The summary is generated from the reason for visit.</p>
            </div>
            <button
              type="button"
              onClick={handleSummary}
              disabled={generating}
              className="inline-flex shrink-0 items-center justify-center gap-2 rounded-md border border-violet-200 bg-white px-3 py-2 text-xs font-bold text-violet-700 transition hover:bg-violet-100 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <Sparkles className="size-3" />
              {generating ? 'Generating...' : 'Generate summary'}
            </button>
          </div>

          {form.ai_summary && (
            <div className="mt-3 rounded-md bg-white p-2.5 text-xs leading-5 text-slate-700 shadow-sm">
              {form.ai_summary}
            </div>
          )}
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="inline-flex w-full items-center justify-center gap-2 rounded-md bg-slate-900 px-4 py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-60"
        >
          <CalendarPlus className="size-4" />
          {submitting ? 'Booking...' : 'Book appointment'}
        </button>
      </form>
    </section>
  );
}
