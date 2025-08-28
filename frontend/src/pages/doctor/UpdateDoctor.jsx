import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../lib/axios.jsx";

const UpdateDoctor = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [err, setErr] = useState("");

    const [form, setForm] = useState({
        name: "",
        email: "",
        specialty: "",
        address: "",
    });

    const loadDoctor = async () => {
        setLoading(true);
        setErr("");
        try {
            const { data } = await api.get(`/api/users/${id}`);
            setForm({
                name: data?.name || "",
                email: data?.email || "",
                specialty: data?.specialty || "",
                address: data?.address || "",
            });
        } catch (e) {
            setErr(e?.response?.data?.message || e.message || "Failed to load doctor");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadDoctor();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id]);

    const onSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        setErr("");
        try {
            // DoctorUpdateRequest: send only fields we change (nulls allowed/ignored)
            const payload = {
                name: form.name || null,
                email: form.email || null,
                specialty: form.specialty || null,
                address: form.address || null,
            };
            await api.patch(`/api/users/${id}/doctor`, payload);
            navigate("/dashboard/doctors");
        } catch (e) {
            setErr(e?.response?.data?.message || e.message || "Failed to update doctor");
            setSaving(false);
        }
    };

    return (
        <div className="p-6">
            <div className="bg-white rounded-lg shadow-lg p-6 max-w-2xl">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-gray-800">Update Doctor</h2>
                    <button
                        onClick={() => navigate(-1)}
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
                                placeholder="doctor@example.com"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Specialty</label>
                            <input
                                value={form.specialty}
                                onChange={(e) => setForm((f) => ({ ...f, specialty: e.target.value }))}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="e.g., Psychiatrist"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
                            <input
                                value={form.address}
                                onChange={(e) => setForm((f) => ({ ...f, address: e.target.value }))}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Clinic address"
                            />
                        </div>

                        <div className="flex justify-end gap-2 pt-2">
                            <button
                                type="button"
                                onClick={() => navigate("/dashboard/doctors")}
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

export default UpdateDoctor;
