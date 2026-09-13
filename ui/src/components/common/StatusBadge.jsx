export default function StatusBadge({ status }) {
  const style = {
    Scheduled: 'bg-green-100 text-sky-700 ring-sky-200',
    Completed: 'bg-emerald-50 text-emerald-700 ring-emerald-200',
    Cancelled: 'bg-rose-50 text-rose-700 ring-rose-200',
  }[status];

  return (
    <span className={`inline-flex rounded px-2.5 py-1 text-xs font-bold ring-1 ring-inset ${style}`}>
      {status}
    </span>
  );
}
