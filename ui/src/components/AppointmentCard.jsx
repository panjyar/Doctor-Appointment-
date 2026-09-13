import { CalendarDays, Check, Clock3, Sparkles, Trash2, X } from 'lucide-react';
import StatusBadge from './common/StatusBadge.jsx';
import { formatDate } from '../utils/date.js';

export default function AppointmentCard({ appointment, onStatus, onDelete, busyId }) {
  const busy = busyId === appointment.id;
  const active = appointment.status === 'Scheduled';

  return (
    <article className="rounded border border-slate-200 bg-white p-4 shadow-sm lg:hidden">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="font-bold text-blue-900">{appointment.patient_name}</h3>
          <p className="mt-1 text-sm text-slate-500">{appointment.mobile_number}</p>
        </div>
        <StatusBadge status={appointment.status} />
      </div>

      <div className="mt-4 grid gap-3 text-sm text-slate-600 sm:grid-cols-2">
        <p><span className="font-semibold text-slate-800">Doctor:</span> {appointment.doctor_name}</p>
        <p><span className="font-semibold text-slate-800">Specialty:</span> {appointment.doctor_specialty}</p>
        <p className="flex items-center gap-2"><CalendarDays className="size-4 text-slate-400" /> {formatDate(appointment.appointment_date)}</p>
        <p className="flex items-center gap-2"><Clock3 className="size-4 text-slate-400" /> {appointment.appointment_time}</p>
      </div>

      <div className="mt-4 rounded-xl bg-slate-50 p-3 text-sm leading-6 text-slate-600">
        <span className="font-semibold text-slate-800">Reason:</span> {appointment.reason_for_visit}
      </div>

      {appointment.ai_summary && (
        <div className="mt-3 flex gap-2 rounded-xl bg-red-50 p-3 text-sm leading-6 text-red-800">
          <Sparkles className="mt-1 size-4 shrink-0" />
          <span>{appointment.ai_summary}</span>
        </div>
      )}

      <div className="mt-4 flex flex-wrap gap-2">
        <button
          type="button"
          disabled={!active || busy}
          onClick={() => onStatus(appointment.id, 'Completed')}
          className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-50 px-3 py-2 text-xs font-bold text-emerald-700 transition hover:bg-emerald-100 disabled:cursor-not-allowed disabled:opacity-40"
        >
          <Check className="size-4" /> Complete
        </button>
        <button
          type="button"
          disabled={!active || busy}
          onClick={() => onStatus(appointment.id, 'Cancelled')}
          className="inline-flex items-center gap-1.5 rounded-lg bg-amber-50 px-3 py-2 text-xs font-bold text-amber-700 transition hover:bg-amber-100 disabled:cursor-not-allowed disabled:opacity-40"
        >
          <X className="size-4" /> Cancel
        </button>
        <button
          type="button"
          disabled={busy}
          onClick={() => onDelete(appointment)}
          className="inline-flex items-center gap-1.5 rounded-lg bg-rose-50 px-3 py-2 text-xs font-bold text-rose-700 transition hover:bg-rose-100 disabled:cursor-not-allowed disabled:opacity-40"
        >
          <Trash2 className="size-4" /> Delete
        </button>
      </div>
    </article>
  );
}
