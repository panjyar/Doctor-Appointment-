import { CalendarDays, Check, Clock3, Trash2, X } from 'lucide-react';
import StatusBadge from './common/StatusBadge.jsx';
import AppointmentCard from './AppointmentCard.jsx';
import { formatDate } from '../utils/date.js';

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
      <div className="rounded-xl border border-dashed border-slate-300 bg-white p-10 text-center shadow-sm">
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

      <div className="hidden overflow-hidden rounded border border-slate-200 bg-white shadow-sm lg:block">
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
                        <p className="mt-2 line-clamp-2 text-red-700"><span className="font-semibold">AI:</span> {appointment.ai_summary}</p>
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
