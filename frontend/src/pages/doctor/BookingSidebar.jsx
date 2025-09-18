import React from "react";

export default function BookingSidebar({
  feeLabel = "",
  pointsLabel = "",
  address = "",
  clinicTabs = [],
  activeClinicIndex = 0,
  onPrevClinic,
  onNextClinic,
  days = [], 
  onSelectSlot,
  selectedSlotId,
  onBook,
}) {
  return (
    <aside className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
      <div className="bg-sky-700 text-white px-4 py-3 font-semibold">Booking Information</div>

      <div className="divide-y">
        {/* Fees / Points row */}
        {pointsLabel ? (
          <div className="grid grid-cols-2 text-center py-4">
            <div>
              <div className="text-slate-600 text-xs">Fees</div>
              <div className="text-slate-900 font-semibold">{feeLabel}</div>
            </div>
            <div>
              <div className="text-emerald-600 font-semibold">{pointsLabel}</div>
            </div>
          </div>
        ) : (
          <div className="py-4 text-center">
            <div className="text-slate-600 text-xs">Fees</div>
            <div className="text-slate-900 font-semibold">{feeLabel}</div>
          </div>
        )}

        {/* Choose clinic (placeholder tabs + address) */}
        <div className="px-4 py-4">
          <div className="text-slate-700 text-sm font-medium mb-2">Choose a clinic</div>
          {Array.isArray(clinicTabs) && clinicTabs.length > 0 ? (
            <div className="flex items-center justify-between mb-2">
              <button type="button" className="px-2 py-1 text-sky-700" onClick={onPrevClinic}>{"<"}</button>
              <div className="flex gap-3">
                {clinicTabs.map((t, i) => (
                  <div key={t} className={`pb-2 border-b-2 ${i === activeClinicIndex ? 'border-sky-600 text-sky-700' : 'border-transparent text-slate-500'}`}>{t}</div>
                ))}
              </div>
              <button type="button" className="px-2 py-1 text-sky-700" onClick={onNextClinic}>{">"}</button>
            </div>
          ) : null}
          {address && (
            <div className="text-slate-600 text-sm">📍 {address}</div>
          )}
        </div>

        {/* Choose your appointment (days carousel style simplified) */}
        <div className="px-4 py-4">
          <div className="text-slate-800 font-medium mb-3">Choose your appointment</div>
          <div className="flex gap-3 overflow-x-auto pb-2">
            {days.map((day) => (
              <div key={day.key} className="min-w-[160px] border rounded-lg overflow-hidden">
                <div className="bg-sky-700 text-white text-sm text-center py-2">{day.heading}</div>
                <div className="p-3 space-y-2">
                  {day.items && day.items.length > 0 ? (
                    day.items.map((it) => (
                      <button
                        key={it.id}
                        type="button"
                        disabled={it.booked || it.past}
                        onClick={() => onSelectSlot?.(it)}
                        className={`w-full text-center px-3 py-2 rounded border ${it.booked || it.past ? 'text-slate-400 bg-slate-50' : (selectedSlotId === it.id ? 'bg-sky-600 text-white border-sky-600' : 'hover:bg-sky-50 text-slate-800')}`}
                      >
                        {it.timeLabel}
                      </button>
                    ))
                  ) : (
                    <div className="text-slate-400 text-sm">No Available Appointments</div>
                  )}
                </div>
                <div className="p-2">
                  {(() => {
                    const hasSelection = Array.isArray(day.items) && day.items.some((it) => it.id === selectedSlotId);
                    return (
                      <button
                        type="button"
                        disabled={!hasSelection}
                        onClick={() => hasSelection && onBook?.()}
                        className={`w-full rounded py-2 ${hasSelection ? 'bg-rose-600 text-white hover:bg-rose-700' : 'bg-slate-300 text-slate-600 cursor-not-allowed'}`}
                      >
                        BOOK
                      </button>
                    );
                  })()}
                </div>
              </div>
            ))}
          </div>
          <div className="text-slate-400 text-xs mt-2">Reservation required, first-come, first-served</div>
        </div>
      </div>
    </aside>
  );
}
