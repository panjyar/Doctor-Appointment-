import { CircleCheck, CircleX, X } from 'lucide-react';

export default function Toast({ toast, onClose }) {
  if (!toast) return null;

  const success = toast.type === 'success';

  return (
    <div className="fixed right-4 top-4 z-50 w-[calc(100%-2rem)] max-w-sm">
      <div
        className={`flex items-start gap-3 rounded-2xl border bg-white p-4 shadow-xl ${
          success ? 'border-emerald-200' : 'border-rose-200'
        }`}
      >
        {success ? (
          <CircleCheck className="mt-0.5 size-5 shrink-0 text-emerald-600" />
        ) : (
          <CircleX className="mt-0.5 size-5 shrink-0 text-rose-600" />
        )}
        <p className="flex-1 text-sm font-medium text-slate-700">{toast.message}</p>
        <button
          type="button"
          onClick={onClose}
          className="rounded-lg p-1 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
          aria-label="Close notification"
        >
          <X className="size-4" />
        </button>
      </div>
    </div>
  );
}
