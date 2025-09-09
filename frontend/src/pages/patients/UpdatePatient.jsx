import { useEffect } from "react";
import usePatient from "../../hooks/patientHook";

const UpdatePatient = () => {
  const { update } = usePatient();
  const { id, form, setForm, loading, saving, err, onSubmit, load, goBack, goPatients } = update;

  // fetch data when the page opens / id changes
  useEffect(() => {
    load();
  }, [id, load]);

  return (
    <div className="w-full min-h-[calc(100vh-80px)] px-3 sm:px-6 lg:px-8 xl:px-10 py-6">
      <div className="w-full bg-white rounded-2xl shadow-sm border border-slate-200">
        {/* Header */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between px-6 py-5 border-b border-slate-200">
          <h2 className="text-2xl font-semibold text-slate-900">Edit Patient</h2>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={goBack}
              className="px-4 py-2 rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-50"
            >
              ← Back
            </button>
          </div>
        </div>

        {/* Alerts */}
        <div className="px-6 pt-5">
          {loading && (
            <div className="p-6 text-center text-slate-500">Loading…</div>
          )}

          {!!err && !loading && (
            <div className="mb-4 rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-rose-700">
              {err}
            </div>
          )}
        </div>

        {/* Form */}
        {!loading && !err && (
          <form onSubmit={onSubmit} className="px-6 pb-6">
            <fieldset disabled={saving} className="group/fieldset">
              <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                {/* Full Name */}
                <div className="md:col-span-12">
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Full Name
                  </label>
                  <input
                    value={form.name}
                    onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                    placeholder="Full name"
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* Email */}
                <div className="md:col-span-12 lg:col-span-6">
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                    placeholder="patient@example.com"
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* Phone */}
                <div className="md:col-span-12 lg:col-span-6">
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Phone Number
                  </label>
                  <input
                    value={form.phoneNumber}
                    onChange={(e) => setForm((f) => ({ ...f, phoneNumber: e.target.value }))}
                    placeholder="Enter phone number"
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* Gender */}
                <div className="md:col-span-12 lg:col-span-6">
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Gender
                  </label>
                  <select
                    value={form.gender}
                    onChange={(e) => setForm((f) => ({ ...f, gender: e.target.value }))}
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select gender</option>
                    <option value="MALE">Male</option>
                    <option value="FEMALE">Female</option>
                    <option value="OTHER">Other</option>
                  </select>
                </div>

                {/* Address */}
                <div className="md:col-span-12">
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Address
                  </label>
                  <input
                    value={form.address}
                    onChange={(e) => setForm((f) => ({ ...f, address: e.target.value }))}
                    placeholder="Full address"
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* Actions */}
              <div className="mt-8 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={goPatients}
                  className="px-4 py-2 rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-50"
                  disabled={saving}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className={`px-6 py-2 rounded-lg text-white transition-colors ${
                    saving ? "bg-blue-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
                  }`}
                >
                  {saving ? "Saving…" : "Save Changes"}
                </button>
              </div>
            </fieldset>
          </form>
        )}
      </div>
    </div>
  );
};

export default UpdatePatient;
