const PatientUpcomingAppointments = () => {
  const appointments = [
    { id: 1, date: "2025-08-15", time: "10:00 AM", doctor: "Dr. Adams" },
    { id: 2, date: "2025-08-20", time: "2:30 PM", doctor: "Dr. Brown" },
  ];

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Upcoming Appointments</h2>
      <ul className="space-y-2">
        {appointments.map((a) => (
          <li
            key={a.id}
            className="p-4 bg-white shadow rounded-lg border flex justify-between"
          >
            <span>{a.date} at {a.time}</span>
            <span className="font-semibold">{a.doctor}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PatientUpcomingAppointments;
