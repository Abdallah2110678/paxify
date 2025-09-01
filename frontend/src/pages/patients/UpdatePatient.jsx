import useUpdatePatient from "../../hooks/useUpdatePatient";

const UpdatePatient = () => {
    const { id, form, setForm, loading, saving, err, onSubmit, goBack, goPatients } = useUpdatePatient();

    return (
        <div className="p-6">
            <div className="bg-white rounded-lg shadow-lg p-6 max-w-2xl">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-gray-800">Edit Patient</h2>
                    <button
                        onClick={goBack}
                        className="px-4 py-2 rounded-lg border border-slate-300 hover:bg-slate-50"
                    >
                        ← Back
                    </button>
                </div>

                {loading && <div className="p-6 text-center text-slate-500">Loading…</div>}

                {err && !loading && (
                    <div className="p-4 rounded-lg bg-rose-50 text-rose-700 border border-rose-200 mb-4">
                        {err}
                    </div>
                )}

                {!loading && !err && (
                    <form onSubmit={onSubmit} className="space-y-5">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                            <input
                                value={form.name}
                                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Full name"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                            <input
                                type="email"
                                value={form.email}
                                onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="patient@example.com"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                            <input
                                value={form.phoneNumber}
                                onChange={(e) => setForm((f) => ({ ...f, phoneNumber: e.target.value }))}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Enter phone number"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Gender</label>
                            <select
                                value={form.gender}
                                onChange={(e) => setForm((f) => ({ ...f, gender: e.target.value }))}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="">Select gender</option>
                                <option value="MALE">Male</option>
                                <option value="FEMALE">Female</option>
                                <option value="OTHER">Other</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
                            <input
                                value={form.address}
                                onChange={(e) => setForm((f) => ({ ...f, address: e.target.value }))}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Full address"
                            />
                        </div>

                        <div className="flex justify-end gap-2 pt-2">
                            <button
                                type="button"
                                onClick={goPatients}
                                className="px-4 py-2 rounded-lg border border-slate-300 hover:bg-slate-50"
                                disabled={saving}
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className={`px-4 py-2 rounded-lg text-white ${saving ? "bg-blue-400" : "bg-blue-600 hover:bg-blue-700"
                                    }`}
                                disabled={saving}
                            >
                                {saving ? "Saving…" : "Save Changes"}
                            </button>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
};

export default UpdatePatient;
