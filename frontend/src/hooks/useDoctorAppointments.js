import { useMemo, useState } from "react";

const dummyAppointments = [
  { id: 1, patient: "Ahmed Ali", type: "Online", time: "2025-08-04 10:00 AM", price: "$50" },
  { id: 2, patient: "Sara Hamed", type: "In-person", time: "2025-08-05 3:00 PM", price: "$70" },
  { id: 3, patient: "Ali Youssef", type: "Online", time: "2025-08-06 11:30 AM", price: "$60" },
];

export default function useDoctorAppointments() {
  const [filter, setFilter] = useState("All");

  const filtered = useMemo(() => {
    if (filter === "All") return dummyAppointments;
    return dummyAppointments.filter((a) => a.type === filter);
  }, [filter]);

  const filters = [
    { label: "All", value: "All" },
    { label: "Online", value: "Online" },
    { label: "Offline", value: "In-person" },
  ];

  return { filter, setFilter, filtered, filters };
}
