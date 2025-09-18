import React, { useState } from "react";
import DoctorDescription from "./DoctorDescription";
import doctorDescriptionHook from "../../hooks/doctorDescriptionHook";
import doctorSchedualhook from "../../hooks/doctorSchedualhook";
import BookingSidebar from "./BookingSidebar";
import BookingModal from "./BookingModal";
import { useBookingPatientForm } from "../../hooks/patientHook";

export default function DoctorDescriptionContainer() {
  const {
    id,
    loading,
    error,
    doctorProps,
    highlights,
    specializations,
    reviewsSummary,
    reviews,
    submitReview,
    submitting,
    consultationFee,
  } = doctorDescriptionHook();

  const [form, setForm] = useState({ rating: 5, comment: "" });
  const schedule = doctorSchedualhook(id);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [selectedSlotId, setSelectedSlotId] = useState(null);
  const booking = useBookingPatientForm();

  return (
    <div className="container mx-auto px-4 py-8">
      {loading && <div className="p-4 text-slate-500">Loading…</div>}
      {error && !loading && (
        <div className="mb-6 p-3 rounded bg-rose-50 border border-rose-200 text-rose-700">{error}</div>
      )}

      {!loading && (
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-[1fr_24rem] gap-6">
          {/* Left: description + reviews */}
          <div>
            <DoctorDescription
              doctor={doctorProps}
              highlights={highlights}
              specializations={specializations}
              reviewsSummary={reviewsSummary}
              reviews={reviews}
            />

            {/* Simple review form (container-level). The presentational page stays pure. */}
            <section className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 mt-6">
              <h2 className="text-lg font-semibold text-slate-800 mb-4">Leave a Review</h2>
              <form
                onSubmit={async (e) => {
                  e.preventDefault();
                  await submitReview({ rating: Number(form.rating), comment: form.comment });
                  setForm({ rating: 5, comment: "" });
                }}
                className="grid grid-cols-1 md:grid-cols-3 gap-4"
              >
                <div>
                  <label className="block text-sm text-slate-700 mb-1">Rating</label>
                  <select
                    className="w-full border rounded px-3 py-2"
                    value={form.rating}
                    onChange={(e) => setForm((p) => ({ ...p, rating: e.target.value }))}
                  >
                    {[5, 4, 3, 2, 1].map((n) => (
                      <option key={n} value={n}>{n}</option>
                    ))}
                  </select>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm text-slate-700 mb-1">Comment (optional)</label>
                  <textarea
                    className="w-full border rounded px-3 py-2"
                    rows={3}
                    value={form.comment}
                    onChange={(e) => setForm((p) => ({ ...p, comment: e.target.value }))}
                    placeholder="Write your feedback…"
                  />
                </div>
                <div className="md:col-span-3 flex justify-end">
                  <button
                    type="submit"
                    disabled={submitting}
                    className="bg-sky-600 text-white px-5 py-2 rounded hover:bg-sky-700"
                  >
                    {submitting ? "Submitting…" : "Submit Review"}
                  </button>
                </div>
              </form>
            </section>
          </div>

          {/* Right: booking sidebar (presentational) */}
          <div className="lg:sticky lg:top-24 self-start">
            <BookingSidebar
              feeLabel={consultationFee != null ? `L.E ${consultationFee}` : ""}
              pointsLabel={""}
              address={doctorProps.address}
              days={schedule.days}
              onSelectSlot={(slot) => setSelectedSlotId(slot?.id)}
              selectedSlotId={selectedSlotId}
              onBook={() => {
                const flat = Array.isArray(schedule.days) ? schedule.days.flatMap(d => d.items || []) : [];
                const slot = flat.find(it => it.id === selectedSlotId);
                if (slot) setSelectedSlot(slot);
              }}
            />
          </div>
        </div>
      )}

      <BookingModal
        open={Boolean(selectedSlot)}
        onClose={() => setSelectedSlot(null)}
        selectedSlot={selectedSlot}
        doctor={doctorProps}
        feeLabel={consultationFee != null ? `L.E ${consultationFee}` : ""}
        address={doctorProps.address}
        form={booking.form}
        setName={booking.setName}
        setPhone={booking.setPhone}
        setEmail={booking.setEmail}
        canBook={booking.canBook}
        onBook={async ({ name, phone, email, slot, doctor }) => {
          booking.reset();
          setSelectedSlot(null);
        }}
      />
    </div>
  );
}
