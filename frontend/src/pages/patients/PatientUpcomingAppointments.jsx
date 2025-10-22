import React from "react";
import { usePatientAppointments } from "../../hooks/patientHook";
import useI18n from "../../hooks/useI18n";

export default function PatientUpcomingAppointments() {
  const { loading, error, items, onCancel } = usePatientAppointments();
  const { t } = useI18n();

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">{t("doctor.overview.upcoming", "Upcoming Appointments")}</h2>

      {loading && (
        <div className="p-3 text-slate-500 bg-white rounded border">{t("doctor.overview.loading", "Loading...")}</div>
      )}

      {error && !loading && (
        <div className="p-3 text-rose-700 bg-rose-50 border border-rose-200 rounded">{error}</div>
      )}

      {!loading && !error && (
        <ul className="space-y-2">
          {items.length === 0 ? (
            <li className="p-4 bg-white shadow rounded-lg border text-slate-500">{t("doctor.overview.noAppointments", "No upcoming appointments")}</li>
          ) : (
            items.map((a) => (
              <li key={a.id} className="p-4 bg-white shadow rounded-lg border flex items-center justify-between gap-4">
                <div>
                  <div className="text-slate-800 font-medium">
                    {a.dateLabel} {t("patientDashboard.at", "at")} {a.timeLabel}
                  </div>
                  <div className="text-slate-500 text-sm">
                    {a.doctorName || t("patientDashboard.doctor", "Doctor")} • {a.sessionTypeLabel}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {a.priceLabel && (
                    <span className="text-slate-600 text-sm">{a.priceLabel}</span>
                  )}
                  <button
                    type="button"
                    onClick={() => onCancel(a.id)}
                    className="px-3 py-1.5 rounded bg-rose-600 text-white hover:bg-rose-700"
                  >
                    {t("patientDashboard.cancel", "Cancel")}
                  </button>
                </div>
              </li>
            ))
          )}
        </ul>
      )}
    </div>
  );
}

