import React from "react";

export default function BookingModal({
  open,
  onClose,
  onBook,
  selectedSlot,
  doctor = {},
  feeLabel = "",
  address = "",
  form,
  setName,
  setPhone,
  setEmail,
  canBook,
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative bg-white w-full max-w-lg rounded-2xl shadow-xl overflow-hidden">
        <div className="bg-sky-700 text-white px-5 py-3 font-semibold">Booking Information</div>
        <div className="p-5 space-y-4">
          {/* Fees / address */}
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div>
              <div className="text-slate-600">Fees</div>
              <div className="text-slate-900 font-semibold">{feeLabel}</div>
            </div>
            <div>
              <div className="text-slate-600">Clinic</div>
              <div className="text-slate-900 font-semibold truncate" title={address}>📍 {address || doctor.address}</div>
            </div>
          </div>

          {/* Selected slot summary */}
          <div className="bg-slate-50 rounded-lg p-3 text-slate-700">
            <div className="font-medium mb-1">Enter Your Info.</div>
            <div className="text-sm">
              {selectedSlot ? (
                <>
                  <div>Appointment: <span className="font-semibold">{selectedSlot.date?.toLocaleDateString?.() || ""}</span> - <span className="font-semibold">{selectedSlot.timeLabel}</span></div>
                </>
              ) : (
                <div>No appointment selected.</div>
              )}
            </div>
          </div>

          {/* Simple form fields (display-only here; no logic) */}
          <form className="grid grid-cols-1 md:grid-cols-2 gap-4" onSubmit={(e) => e.preventDefault()}>
            <div className="md:col-span-2">
              <label className="block text-sm text-slate-700 mb-1">Patient name </label>
              <input className="w-full border rounded px-3 py-2" placeholder="Your name" value={form?.name || ""} onChange={(e) => setName?.(e.target.value)} />
            </div>
            <div>
              <label className="block text-sm text-slate-700 mb-1">Mobile Number</label>
              <input className="w-full border rounded px-3 py-2" placeholder="0100 000 0000" value={form?.phone || ""} onChange={(e) => setPhone?.(e.target.value)} />
            </div>
            <div>
              <label className="block text-sm text-slate-700 mb-1">Email Address (Optional)</label>
              <input className="w-full border rounded px-3 py-2" placeholder="you@example.com" value={form?.email || ""} onChange={(e) => setEmail?.(e.target.value)} />
            </div>
           
          </form>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-2">
            <button type="button" className="px-4 py-2 rounded border" onClick={onClose}>Cancel</button>
            <button type="button" className="px-5 py-2 rounded bg-rose-600 text-white disabled:opacity-60" disabled={!canBook} onClick={() => onBook?.({ ...form, slot: selectedSlot, doctor })}>
              Book
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
