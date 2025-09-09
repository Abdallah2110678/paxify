import usePatient from "../../hooks/patientHook";
import { useAuth } from "../../context/AuthContext.jsx";

const AddPatient = () => {
    const { addPatient } = usePatient();
    const { user } = useAuth();
    const { form, setForm, saving, err, onSubmit, goBack } = addPatient;

    const notAdmin = !user || user.role !== "ADMIN";

    return (
        <div className="w-full min-h-[calc(100vh-80px)] px-3 sm:px-6 lg:px-8 xl:px-10 py-6">
            {/* Full-width card (no max-w) */}
            <div className="w-full bg-white rounded-2xl shadow-sm border border-slate-200">
                {/* Header */}
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between px-6 py-5 border-b border-slate-200">
                    <h2 className="text-2xl font-semibold text-slate-900">Add New Patient</h2>
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
                    {notAdmin && (
                        <div className="mb-4 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-amber-800">
                            Admins only.{" "}
                            {user ? (
                                <>You are logged in as <b>{user.role}</b>.</>
                            ) : (
                                <>Please log in.</>
                            )}
                        </div>
                    )}

                    {err && (
                        <div className="mb-4 rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-rose-700">
                            {err}
                        </div>
                    )}
                </div>

                {/* Form (full-width, 12-col grid) */}
                <form onSubmit={onSubmit} className="px-6 pb-6">
                    <fieldset disabled={saving || notAdmin} className="group/fieldset">
                        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                            {/* Full Name (span 12) */}
                            <div className="md:col-span-12">
                                <label className="block text-sm font-medium text-slate-700 mb-2">
                                    Full Name <span className="text-rose-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    value={form.name}
                                    onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                                    placeholder="Enter full name"
                                    className="w-full rounded-lg border border-slate-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>

                            {/* Email (span 6) */}
                            <div className="md:col-span-6">
                                <label className="block text-sm font-medium text-slate-700 mb-2">
                                    Email <span className="text-rose-500">*</span>
                                </label>
                                <input
                                    type="email"
                                    value={form.email}
                                    onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                                    placeholder="patient@example.com"
                                    className="w-full rounded-lg border border-slate-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>

                            {/* Password (span 6) */}
                            <div className="md:col-span-6">
                                <label className="block text-sm font-medium text-slate-700 mb-2">
                                    Password <span className="text-rose-500">*</span>
                                </label>
                                <input
                                    type="password"
                                    value={form.password}
                                    onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
                                    placeholder="Set a password"
                                    className="w-full rounded-lg border border-slate-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>

                            {/* Phone (span 6) */}
                            <div className="md:col-span-6">
                                <label className="block text-sm font-medium text-slate-700 mb-2">
                                    Phone Number
                                </label>
                                <input
                                    type="tel"
                                    value={form.phoneNumber}
                                    onChange={(e) => setForm((f) => ({ ...f, phoneNumber: e.target.value }))}
                                    placeholder="Enter phone number"
                                    className="w-full rounded-lg border border-slate-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>

                            {/* Gender (span 6) */}
                            <div className="md:col-span-6">
                                <label className="block text-sm font-medium text-slate-700 mb-2">
                                    Gender <span className="text-rose-500">*</span>
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

                            {/* Address (span 12) */}
                            <div className="md:col-span-12">
                                <label className="block text-sm font-medium text-slate-700 mb-2">Address</label>
                                <input
                                    type="text"
                                    value={form.address}
                                    onChange={(e) => setForm((f) => ({ ...f, address: e.target.value }))}
                                    placeholder="Enter full address"
                                    className="w-full rounded-lg border border-slate-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="mt-8 flex items-center justify-end gap-3">
                            <button
                                type="button"
                                onClick={goBack}
                                className="px-4 py-2 rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-50"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={saving || notAdmin}
                                className={`px-6 py-2 rounded-lg text-white transition-colors ${saving || notAdmin ? "bg-blue-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
                                    }`}
                            >
                                {saving ? "Adding…" : "Add Patient"}
                            </button>
                        </div>
                    </fieldset>
                </form>
            </div>
        </div>
    );
};

export default AddPatient;
