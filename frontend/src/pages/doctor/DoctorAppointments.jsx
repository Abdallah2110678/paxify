import DoctorHook from "../../hooks/doctorHook";

const DoctorAppointments = () => {
  const { appointments } = DoctorHook();
  const { rows, loading, err, filter, setFilter, filters, format, actions, edit } = appointments;

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

        {err && (
          <div className="mb-4 p-3 rounded bg-rose-50 border border-rose-200 text-rose-700">{err}</div>
        )}

        <div className="overflow-x-auto">
          <table className="w-full table-auto border-collapse">
            <thead className="bg-gray-100 text-gray-600 text-left">
              <tr>
                <th className="px-4 py-2">Patient</th>
                <th className="px-4 py-2">Type</th>
                <th className="px-4 py-2">Time</th>
                <th className="px-4 py-2">Price</th>
                <th className="px-4 py-2 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading && (
                <tr>
                  <td colSpan="5" className="px-4 py-6 text-center text-gray-500">Loading...</td>
                </tr>
              )}
              {!loading && rows.map((appt) => (
                <tr key={appt.id || appt.appointmentId} className="border-t hover:bg-gray-50">
                  <td className="px-4 py-2">{appt?.patient?.name || "-"}</td>
                  <td className="px-4 py-2">{format.type(appt?.sessionType)}</td>
                  <td className="px-4 py-2">{format.dateTime(appt?.dateTime || appt?.appointmentDateTime)}</td>
                  <td className="px-4 py-2">{format.price(appt?.price)}</td>
                  <td className="px-4 py-2">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        className="px-3 py-1 rounded bg-amber-500 hover:bg-amber-600 text-white text-sm"
                        onClick={() => actions.openEdit(appt)}
                      >
                        Edit
                      </button>
                      <button
                        className="px-3 py-1 rounded bg-rose-600 hover:bg-rose-700 text-white text-sm"
                        onClick={() => actions.delete(appt)}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {!loading && rows.length === 0 && !err && (
                <tr>
                  <td colSpan="5" className="text-center py-6 text-gray-500">
                    No appointments found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit Modal */}
      {edit.open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white w-full max-w-md rounded-lg shadow-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Edit Appointment</h3>
              <button onClick={edit.onClose} className="text-gray-500 hover:text-gray-700">✕</button>
            </div>

            {edit.err && (
              <div className="mb-3 p-2 rounded bg-rose-50 border border-rose-200 text-rose-700 text-sm">{edit.err}</div>
            )}

            <form onSubmit={edit.onSubmit} className="space-y-3">
              <div>
                <label className="block text-sm text-gray-600 mb-1">Date & Time</label>
                <input
                  type="datetime-local"
                  name="dateTime"
                  value={edit.form.dateTime || ""}
                  onChange={edit.onChange}
                  className="w-full border rounded px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">Type</label>
                <select
                  name="sessionType"
                  value={edit.form.sessionType || "ONLINE"}
                  onChange={edit.onChange}
                  className="w-full border rounded px-3 py-2"
                >
                  <option value="ONLINE">Online</option>
                  <option value="IN_PERSON">In-person</option>
                </select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm text-gray-600 mb-1">Duration (min)</label>
                  <input
                    type="number"
                    name="durationMinutes"
                    value={edit.form.durationMinutes}
                    onChange={edit.onChange}
                    className="w-full border rounded px-3 py-2"
                    min="15"
                    step="15"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-1">Price (L.E)</label>
                  <input
                    type="number"
                    name="price"
                    value={edit.form.price}
                    onChange={edit.onChange}
                    className="w-full border rounded px-3 py-2"
                    step="0.01"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">Notes</label>
                <textarea
                  name="notes"
                  value={edit.form.notes}
                  onChange={edit.onChange}
                  className="w-full border rounded px-3 py-2"
                  rows="3"
                />
              </div>
              <div className="flex items-center justify-end gap-2 pt-2">
                <button type="button" onClick={edit.onClose} className="px-4 py-2 rounded border">Cancel</button>
                <button
                  type="submit"
                  disabled={edit.saving}
                  className={`px-4 py-2 rounded text-white ${edit.saving ? "bg-gray-400" : "bg-blue-600 hover:bg-blue-700"}`}
                >
                  {edit.saving ? "Saving..." : "Save"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default DoctorAppointments;
