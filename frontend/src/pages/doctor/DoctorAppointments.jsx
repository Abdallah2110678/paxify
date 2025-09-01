import useDoctorAppointments from "../../hooks/useDoctorAppointments";

const DoctorAppointments = () => {
  const { filter, setFilter, filtered, filters } = useDoctorAppointments();

  return (
    <div className="p-6">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-800">My Appointments</h2>

          <div className="space-x-2">
            {filters.map(({ label, value }) => (
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
