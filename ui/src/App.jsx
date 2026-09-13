import { CalendarCheck2, RefreshCw } from 'lucide-react';
import AppointmentForm from './components/AppointmentForm.jsx';
import AppointmentTable from './components/AppointmentTable.jsx';
import Toast from './components/Toast.jsx';
import { useToast } from './hooks/useToast.js';
import { useAppointments } from './hooks/useAppointments.js';

export default function App() {
  const { toast, notify, closeToast } = useToast();

  const {
    doctors,
    appointments,
    loading,
    submitting,
    busyId,
    scheduledCount,
    handleCreate,
    handleStatus,
    handleDelete,
    handleGenerateSummary,
  } = useAppointments(notify);

  return (
    <div className="min-h-screen">
      <Toast toast={toast} onClose={closeToast} />

      <header className="border-b border-slate-200/80 bg-white/80 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <div className="shadow-sm w-15">
              <img src="https://t3.ftcdn.net/jpg/03/24/58/44/360_F_324584485_qtdluDzmBNkJvmntEPlNeG1htwPktgCa.jpg" alt="" />
            </div>
            <div>
              <h1 className="text-lg font-black tracking-tight text-slate-900">CareSlot</h1>
              <p className="text-xs font-medium text-slate-500">Mini Appointment Booking App</p>
            </div>
          </div>
          <div className="hidden  bg-green-300 px-3 py-1.5 text-xs font-bold text-blue-900 sm:block">
            {scheduledCount} scheduled
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-3">
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
                <p className="text-sm font-bold uppercase text-red-700">Appointments</p>
                <h2 className="mt-1 text-2xl font-black tracking-tight text-blue-900">Upcoming & recent bookings</h2>
              </div>
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
