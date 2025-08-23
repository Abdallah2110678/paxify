const upcomingAppointments = [
  { id: 1, patient: "Ahmed Ali", type: "Online", time: "2025-08-04 10:00 AM" },
  { id: 2, patient: "Sara Hamed", type: "In-person", time: "2025-08-05 3:00 PM" },
  { id: 3, patient: "Ali Youssef", type: "Online", time: "2025-08-06 11:30 AM" },
];

const DoctorOverview = () => {
  const onlineCount = upcomingAppointments.filter(a => a.type === "Online").length;
  const offlineCount = upcomingAppointments.filter(a => a.type === "In-person").length;

  return (
    <div className="p-6">
      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
        {/* Online Appointments Card */}
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg shadow-lg p-6">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-white text-sm opacity-80">Online Appointments</p>
              <h3 className="text-white text-2xl font-bold">{onlineCount}</h3>
            </div>
            <div className="bg-blue-400 bg-opacity-30 p-3 rounded-full">
              <span className="text-3xl">💻</span>
            </div>
          </div>
        </div>

        {/* Offline Appointments Card */}
        <div className="bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-lg shadow-lg p-6">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-white text-sm opacity-80">Offline Appointments</p>
              <h3 className="text-white text-2xl font-bold">{offlineCount}</h3>
            </div>
            <div className="bg-indigo-400 bg-opacity-30 p-3 rounded-full">
              <span className="text-3xl">🏥</span>
            </div>
          </div>
        </div>

        {/* Total Appointments Card */}
        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg shadow-lg p-6">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-white text-sm opacity-80">Total Appointments</p>
              <h3 className="text-white text-2xl font-bold">{upcomingAppointments.length}</h3>
            </div>
            <div className="bg-purple-400 bg-opacity-30 p-3 rounded-full">
              <span className="text-3xl">📅</span>
            </div>
          </div>
        </div>
      </div>

      {/* Upcoming Appointments Section */}
      <div className="mt-6 bg-white rounded-lg shadow-lg p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-4">Upcoming Appointments</h3>
        <div className="space-y-4">
          {upcomingAppointments.map((appt) => (
            <div key={appt.id} className="flex items-center p-4 bg-gray-50 rounded-lg">
              <div className="bg-blue-100 p-3 rounded-full mr-4">
                <span className="text-xl">🧑‍⚕️</span>
              </div>
              <div>
                <p className="text-gray-800 font-medium">{appt.patient}</p>
                <p className="text-gray-500 text-sm">{appt.type} - {appt.time}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DoctorOverview;
