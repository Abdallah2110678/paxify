import { useState, useMemo } from "react";
import doctorSchedualhook from "../../hooks/doctorSchedualhook";
import DoctorSchedule from "./DoctorSchedule";

// Container that connects the schedule hook with the pure UI component
export default function DoctorScheduleContainer({ doctorId, onBook }) {
  const { loading, error, days, refetch } = doctorSchedualhook(doctorId);
  const [selectedId, setSelectedId] = useState(null);

  const allItems = useMemo(() => days.flatMap((d) => d.items), [days]);

  const handleBook = (selected) => {
    const chosen = allItems.find((i) => i.id === selected && !i.booked);
    if (chosen) onBook?.(chosen);
  };

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
