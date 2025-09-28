import { useCallback, useEffect, useMemo, useState } from "react";
import { getDoctorFutureAppointmentsPublic } from "../services/appointmentService";

// Fetch and prepare schedule data for a doctor without any UI concerns
export default function doctorSchedualhook(doctorId) {
  const [slots, setSlots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchSlots = useCallback(async () => {
    if (!doctorId) return;
    setLoading(true);
    setError("");
    try {
      const data = await getDoctorFutureAppointmentsPublic(doctorId);
      setSlots(Array.isArray(data) ? data : (data?.items || data?.data || []));
    } catch (e) {
      setError(e?.response?.data?.message || e.message || "Failed to load slots");
    } finally {
      setLoading(false);
    }
  }, [doctorId]);

  useEffect(() => {
    fetchSlots();
  }, [fetchSlots]);

  // Group slots by day; normalize fields coming from backend
  const days = useMemo(() => {
    const byDay = {};
    const now = new Date();
    for (const s of slots) {
      // Map common backend fields; backend returns 'appointmentDateTime'
      const iso = s.appointmentDateTime || s.dateTime || s.startTime || s.start || s.datetime || s.time;
      if (!iso) continue;
      const d = new Date(iso);
      const dayKey = d.toISOString().slice(0, 10);
      const item = {
        id: s.id ?? s.appointmentId ?? `${dayKey}-${d.getTime()}`,
        date: d,
        timeLabel: d.toLocaleTimeString(undefined, { hour: "numeric", minute: "2-digit" }),
        booked: Boolean(s.booked || s.isBooked || (s.status && String(s.status).toUpperCase() !== 'AVAILABLE')),
        past: d < now,
      };
      (byDay[dayKey] ||= []).push(item);
    }
    const entries = Object.entries(byDay)
      .sort(([a], [b]) => (a < b ? -1 : 1))
      .map(([key, arr]) => {
        const today = new Date();
        const todayKey = today.toISOString().slice(0, 10);
        const tomorrowKey = new Date(today.getTime() + 86400000).toISOString().slice(0, 10);
        let heading = arr[0].date.toLocaleDateString(undefined, { weekday: "short", day: "2-digit", month: "2-digit" });
        if (key === todayKey) heading = "Today";
        else if (key === tomorrowKey) heading = "Tomorrow";
        // sort by time and separate past/future within the day
        arr.sort((x, y) => x.date - y.date);
        // Keep both past and future items (for greying past times),
        // but later we'll drop entire days that have only past items
        return { key, heading, items: arr };
      })
      // drop days that are fully past (no future items remaining)
      .filter((day) => day.items.some((i) => !i.past))
      // show only first 3 groups
      .slice(0, 3);
    return entries;
  }, [slots]);

  return { loading, error, days, refetch: fetchSlots };
}
