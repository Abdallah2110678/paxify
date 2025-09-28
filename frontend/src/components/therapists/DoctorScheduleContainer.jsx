import { useEffect, useState, useMemo } from "react";
import doctorSchedualhook from "../../hooks/doctorSchedualhook";
import DoctorSchedule from "./DoctorSchedule";

// Container that connects the schedule hook with the pure UI component
export default function DoctorScheduleContainer({ doctorId, onBook, refreshKey = 0 }) {
  const { loading, error, days, refetch } = doctorSchedualhook(doctorId);
  const [selectedId, setSelectedId] = useState(null);

  const allItems = useMemo(() => days.flatMap((d) => d.items), [days]);

  const handleBook = (selected) => {
    const chosen = allItems.find((i) => i.id === selected && !i.booked);
    if (chosen) onBook?.(chosen);
  };

  // When parent says the doctor's schedule changed, refetch without page reload
  useEffect(() => {
    refetch?.();
    // reset selection because the availability changed
    setSelectedId(null);
  }, [refreshKey]);

  return (
    <DoctorSchedule
      days={days}
      loading={loading}
      error={error}
      selectedId={selectedId}
      onSelect={setSelectedId}
      onBook={handleBook}
      refetch={refetch}
    />
  );
}
