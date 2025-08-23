import { useState } from "react";

const dummyAppointments = [
  { id: 1, patient: "Ahmed Ali", type: "Online", time: "2025-08-04 10:00 AM", price: "$50" },
  { id: 2, patient: "Sara Hamed", type: "In-person", time: "2025-08-05 3:00 PM", price: "$70" },
  { id: 3, patient: "Ali Youssef", type: "Online", time: "2025-08-06 11:30 AM", price: "$60" },
];

const DoctorAppointments = () => {
  const [filter, setFilter] = useState("All");

  const filtered =
    filter === "All"
      ? dummyAppointments
      : dummyAppointments.filter((a) => a.type === filter);

  return (
    <div className="p-6">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-800">My Appointments</h2>

          <div className="space-x-2">
            {[
              { label: "All", value: "All" },
              { label: "Online", value: "Online" },
              { label: "Offline", value: "In-person" },
            ].map(({ label, value }) => (
              <button
                key={value}
                onClick={() => setFilter(value)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  filter === value
                    ? "bg-blue-600 text-white"
                    : "bg-white text-blue-600 border border-blue-600 hover:bg-blue-50"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full table-auto border-collapse">
            <thead className="bg-gray-100 text-gray-600 text-left">
              <tr>
                <th className="px-4 py-2">Patient</th>
                <th className="px-4 py-2">Type</th>
                <th className="px-4 py-2">Time</th>
                <th className="px-4 py-2">Price</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((appt) => (
                <tr key={appt.id} className="border-t hover:bg-gray-50">
                  <td className="px-4 py-2">{appt.patient}</td>
                  <td className="px-4 py-2">{appt.type}</td>
                  <td className="px-4 py-2">{appt.time}</td>
                  <td className="px-4 py-2">{appt.price}</td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan="4" className="text-center py-6 text-gray-500">
                    No appointments found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default DoctorAppointments;
