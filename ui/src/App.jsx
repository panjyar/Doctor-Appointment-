import { useEffect, useMemo, useState } from 'react';
import { CalendarCheck2, RefreshCw } from 'lucide-react';
import AppointmentForm from './components/AppointmentForm.jsx';
import AppointmentTable from './components/AppointmentTable.jsx';
import Toast from './components/Toast.jsx';
import { appointmentApi } from './services/api.js';

export default function App() {
  const [doctors, setDoctors] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [busyId, setBusyId] = useState(null);
  const [toast, setToast] = useState(null);

  const scheduledCount = useMemo(
    () => appointments.filter((appointment) => appointment.status === 'Scheduled').length,
    [appointments],
  );

  function notify(message, type = 'success') {
    setToast({ message, type });
    window.setTimeout(() => setToast(null), 3500);
  }

  async function loadData() {
    setLoading(true);
    try {
      const [doctorResult, appointmentResult] = await Promise.all([
        appointmentApi.getDoctors(),
        appointmentApi.getAppointments(),
      ]);
      setDoctors(doctorResult.data);
      setAppointments(appointmentResult.data);
    } catch (error) {
      notify(error.message, 'error');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  async function handleCreate(data) {
    setSubmitting(true);
    try {
      const result = await appointmentApi.createAppointment(data);
      // No page refresh: update the current React state immediately from the API response.
      setAppointments((current) =>
        [...current, result.data].sort((a, b) =>
          `${a.appointment_date} ${a.appointment_time}`.localeCompare(
            `${b.appointment_date} ${b.appointment_time}`,
          ),
        ),
      );
      notify(result.message);
      return true;
    } catch (error) {
      notify(error.message, 'error');
      return false;
    } finally {
      setSubmitting(false);
    }
  }

  async function handleStatus(id, status) {
    setBusyId(id);
    try {
      const result = await appointmentApi.updateStatus(id, status);
      // No page refresh: replace only the changed appointment in state.
      setAppointments((current) =>
        current.map((appointment) => (appointment.id === id ? result.data : appointment)),
      );
      notify(result.message);
    } catch (error) {
      notify(error.message, 'error');
    } finally {
      setBusyId(null);
    }
  }

  async function handleDelete(appointment) {
    const confirmed = window.confirm(
      `Delete the appointment for ${appointment.patient_name}? This cannot be undone.`,
    );
    if (!confirmed) return;

    setBusyId(appointment.id);
    try {
      const result = await appointmentApi.deleteAppointment(appointment.id);
      // No page refresh: remove the deleted row from state.
      setAppointments((current) => current.filter((item) => item.id !== appointment.id));
      notify(result.message);
    } catch (error) {
      notify(error.message, 'error');
    } finally {
      setBusyId(null);
    }
  }

  async function handleGenerateSummary(reasonForVisit) {
    try {
      const result = await appointmentApi.generateSummary(reasonForVisit);
      notify(result.message);
      return result.data.summary;
    } catch (error) {
      notify(error.message, 'error');
      throw error;
    }
  }

  return (
    <div className="min-h-screen">
      <Toast toast={toast} onClose={() => setToast(null)} />

      <header className="border-b border-slate-200/80 bg-white/80 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <div className="rounded-2xl bg-slate-900 p-2.5 text-white shadow-sm">
              <CalendarCheck2 className="size-6" />
            </div>
            <div>
              <h1 className="text-lg font-black tracking-tight text-slate-900">CareSlot</h1>
              <p className="text-xs font-medium text-slate-500">Mini Appointment Booking App</p>
            </div>
          </div>
          <div className="hidden rounded-full bg-sky-50 px-3 py-1.5 text-xs font-bold text-sky-700 sm:block">
            {scheduledCount} scheduled
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
        <div className="grid gap-8 xl:grid-cols-[410px_minmax(0,1fr)] xl:items-start">
          <div className="xl:sticky xl:top-6">
            <AppointmentForm
              doctors={doctors}
              onSubmit={handleCreate}
              onGenerateSummary={handleGenerateSummary}
              submitting={submitting}
            />
          </div>

          <section>
            <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-sm font-bold uppercase tracking-[0.16em] text-sky-600">Appointments</p>
                <h2 className="mt-1 text-2xl font-black tracking-tight text-slate-900">Upcoming & recent bookings</h2>
                <p className="mt-1 text-sm text-slate-500">Changes appear immediately without refreshing the page.</p>
              </div>
              <button
                type="button"
                onClick={loadData}
                disabled={loading}
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-bold text-slate-600 shadow-sm transition hover:bg-slate-50 disabled:opacity-60"
              >
                <RefreshCw className={`size-4 ${loading ? 'animate-spin' : ''}`} />
                Reload from DB
              </button>
            </div>

            <AppointmentTable
              appointments={appointments}
              loading={loading}
              onStatus={handleStatus}
              onDelete={handleDelete}
              busyId={busyId}
            />
          </section>
        </div>
      </main>
    </div>
  );
}
