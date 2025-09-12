// Pure presentational component for the 3-column schedule UI.
// Receives days, loading, error, selectedId, onSelect, onBook from props.
export default function DoctorSchedule({ days = [], loading = false, error = "", selectedId = null, onSelect, onBook }) {
  if (loading) return <div className="text-sm text-slate-500">Loading slots…</div>;
  if (error) return <div className="text-sm text-rose-600">{error}</div>;
  if (!days.length) return <div className="text-sm text-slate-500">No available appointments</div>;

  return (
    <div className="w-full lg:w-auto lg:min-w-[380px]">
      <div className="flex gap-3 justify-between lg:justify-end">
        {days.map((col) => (
          <div key={col.key} className="flex flex-col rounded-lg overflow-hidden border border-slate-200 bg-white w-full max-w-[120px]">
            <div className="bg-sky-700 text-white text-center text-sm py-2 font-medium">{col.heading}</div>
            <div className="px-2 py-2 flex-1">
              {col.items.map((it) => (
                <button
                  key={it.id}
                  type="button"
                  onClick={() => onSelect?.(it.id)}
                  className={`w-full text-center text-sm py-1.5 rounded mb-1 ${it.booked ? 'text-slate-300 line-through cursor-not-allowed' : selectedId === it.id ? 'bg-sky-600 text-white' : 'text-sky-700 hover:bg-sky-50'}`}
                  disabled={it.booked}
                  title={it.booked ? 'Booked' : 'Available'}
                >
                  {it.timeLabel}
                </button>
              ))}
              {col.items.length > 6 && (
                <div className="text-center text-xs text-sky-700 mt-1">More</div>
              )}
            </div>
            <button
              className="bg-rose-600 hover:bg-rose-700 text-white text-sm py-2"
              onClick={() => onBook?.(selectedId)}
              disabled={!selectedId}
            >
              BOOK
            </button>
          </div>
        ))}
      </div>
      <p className="text-center text-slate-500 text-sm mt-2">Appointment reservation</p>
    </div>
  );
}
