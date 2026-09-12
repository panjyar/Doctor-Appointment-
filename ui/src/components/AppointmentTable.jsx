import { CalendarDays, Check, Clock3, Sparkles, Trash2, X } from 'lucide-react';

function StatusBadge({ status }) {
  const style = {
    Scheduled: 'bg-sky-50 text-sky-700 ring-sky-200',
    Completed: 'bg-emerald-50 text-emerald-700 ring-emerald-200',
    Cancelled: 'bg-rose-50 text-rose-700 ring-rose-200',
  }[status];

  return (
    <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-bold ring-1 ring-inset ${style}`}>
      {status}
    </span>
  );
}

function formatDate(value) {
  const date = new Date(`${value}T00:00:00`);
  return new Intl.DateTimeFormat(undefined, {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(date);
}

function AppointmentCard({ appointment, onStatus, onDelete, busyId }) {
  const busy = busyId === appointment.id;
  const active = appointment.status === 'Scheduled';

  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm lg:hidden">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="font-bold text-slate-900">{appointment.patient_name}</h3>
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
        <div className="mt-3 flex gap-2 rounded-xl bg-violet-50 p-3 text-sm leading-6 text-violet-800">
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

export default function AppointmentTable({ appointments, loading, onStatus, onDelete, busyId }) {
  if (loading) {
    return (
      <div className="rounded-3xl border border-slate-200 bg-white p-10 text-center text-sm font-medium text-slate-500 shadow-sm">
        Loading appointments...
      </div>
    );
  }

  if (appointments.length === 0) {
    return (
      <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-10 text-center shadow-sm">
        <CalendarDays className="mx-auto size-9 text-slate-300" />
        <h3 className="mt-3 font-bold text-slate-800">No appointments yet</h3>
        <p className="mt-1 text-sm text-slate-500">Your first booking will appear here immediately after submission.</p>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-3 lg:hidden">
        {appointments.map((appointment) => (
          <AppointmentCard
            key={appointment.id}
            appointment={appointment}
            onStatus={onStatus}
            onDelete={onDelete}
            busyId={busyId}
          />
        ))}
      </div>

      <div className="hidden overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm lg:block">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1100px] text-left text-sm">
            <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
              <tr>
                <th className="px-5 py-4 font-bold">Patient</th>
                <th className="px-5 py-4 font-bold">Doctor</th>
                <th className="px-5 py-4 font-bold">Date & time</th>
                <th className="px-5 py-4 font-bold">Reason / AI summary</th>
                <th className="px-5 py-4 font-bold">Status</th>
                <th className="px-5 py-4 text-right font-bold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {appointments.map((appointment) => {
                const busy = busyId === appointment.id;
                const active = appointment.status === 'Scheduled';
                return (
                  <tr key={appointment.id} className="align-top transition hover:bg-slate-50/70">
                    <td className="px-5 py-5">
                      <p className="font-bold text-slate-900">{appointment.patient_name}</p>
                      <p className="mt-1 text-xs text-slate-500">{appointment.mobile_number}</p>
                    </td>
                    <td className="px-5 py-5">
                      <p className="font-semibold text-slate-800">{appointment.doctor_name}</p>
                      <p className="mt-1 text-xs text-slate-500">{appointment.doctor_specialty}</p>
                    </td>
                    <td className="px-5 py-5 text-slate-600">
                      <p className="flex items-center gap-2"><CalendarDays className="size-4 text-slate-400" /> {formatDate(appointment.appointment_date)}</p>
                      <p className="mt-2 flex items-center gap-2"><Clock3 className="size-4 text-slate-400" /> {appointment.appointment_time}</p>
                    </td>
                    <td className="max-w-sm px-5 py-5 text-slate-600">
                      <p className="line-clamp-2"><span className="font-semibold text-slate-800">Reason:</span> {appointment.reason_for_visit}</p>
                      {appointment.ai_summary && (
                        <p className="mt-2 line-clamp-2 text-violet-700"><span className="font-semibold">AI:</span> {appointment.ai_summary}</p>
                      )}
                    </td>
                    <td className="px-5 py-5"><StatusBadge status={appointment.status} /></td>
                    <td className="px-5 py-5">
                      <div className="flex justify-end gap-2">
                        <button
                          type="button"
                          title="Mark completed"
                          disabled={!active || busy}
                          onClick={() => onStatus(appointment.id, 'Completed')}
                          className="rounded-lg p-2 text-emerald-600 transition hover:bg-emerald-50 disabled:cursor-not-allowed disabled:opacity-30"
                        >
                          <Check className="size-4" />
                        </button>
                        <button
                          type="button"
                          title="Cancel appointment"
                          disabled={!active || busy}
                          onClick={() => onStatus(appointment.id, 'Cancelled')}
                          className="rounded-lg p-2 text-amber-600 transition hover:bg-amber-50 disabled:cursor-not-allowed disabled:opacity-30"
                        >
                          <X className="size-4" />
                        </button>
                        <button
                          type="button"
                          title="Delete appointment"
                          disabled={busy}
                          onClick={() => onDelete(appointment)}
                          className="rounded-lg p-2 text-rose-600 transition hover:bg-rose-50 disabled:cursor-not-allowed disabled:opacity-30"
                        >
                          <Trash2 className="size-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
