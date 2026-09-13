import { CalendarPlus, Sparkles } from 'lucide-react';
import { useAppointmentForm } from '../hooks/useAppointmentForm.js';

export default function AppointmentForm({ doctors, onSubmit, onGenerateSummary, submitting }) {
  const {
    form,
    errors,
    generating,
    minDate,
    availableTimes,
    updateField,
    handleSummary,
    handleSubmit,
    inputClass,
  } = useAppointmentForm(onSubmit, onGenerateSummary);

  return (
    <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
      <div className="mb-4 flex items-start gap-3">
        <div className="rounded-lg bg-sky-50 p-2 text-sky-600 w-15">
          <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQs9s9eRvbdULnTja5MHHPu-PYzL2qL2L99S7Rb1F4WoGFPBzx1JYFVtp4&s=10" alt="" />
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
            placeholder="Describe why the patient is visiting..."
            maxLength={500}
          />
          <div className="mt-1 flex items-center justify-between gap-3">
            <span className="text-xs text-rose-600">{errors.reason_for_visit}</span>
            <span className="text-xs font-medium text-slate-400">{form.reason_for_visit.length}/500</span>
          </div>
        </label>

        <div className="rounded-lg border border-violet-100 bg-violet-50/60 p-3">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <button
              type="button"
              onClick={handleSummary}
              disabled={generating}
              className="inline-flex shrink-0 items-center justify-center gap-2 rounded-md border border-violet-200 bg-white px-3 py-2 text-xs font-bold text-green-700 transition hover:bg-green-400 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {generating ? 'Generating...' : 'Enhance by AI'}
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
          {submitting ? 'Booking...' : 'Book appointment'}
        </button>
      </form>
    </section>
  );
}
