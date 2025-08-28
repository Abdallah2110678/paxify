import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../lib/axios.jsx";

const AddPatient = () => {
    const navigate = useNavigate();
    const [saving, setSaving] = useState(false);
    const [err, setErr] = useState("");

    const [form, setForm] = useState({
        name: "",
        email: "",
        password: "",
        phoneNumber: "",
        address: "",
        gender: "", // MALE / FEMALE / OTHER (match your backend enum)
    });

    const onSubmit = async (e) => {
        e.preventDefault();
        setErr("");

        if (!form.name || !form.email || !form.password || !form.gender) {
            setErr("Name, Email, Password and Gender are required.");
            return;
        }

        try {
            setSaving(true);
            await api.post(
                "/api/users/patients",
                {
                    name: form.name,
                    email: form.email,
                    password: form.password,
                    phoneNumber: form.phoneNumber || null,
                    address: form.address || null,
                    gender: form.gender, // must be one of your Gender enum values
                },
                { headers: { "Content-Type": "application/json" } }
            );
            navigate("/dashboard/patients");
        } catch (e) {
            setErr(e?.response?.data?.message || e.message || "Failed to add patient");
            setSaving(false);
        }
    };

    return (
        <div className="p-6">
            <div className="bg-white rounded-lg shadow-lg p-6 max-w-2xl">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-gray-800">Add New Patient</h2>
                    <button
                        onClick={() => navigate(-1)}
                        className="px-4 py-2 rounded-lg border border-slate-300 hover:bg-slate-50"
                    >
                        ← Back
                    </button>
                </div>

                {err && (
                    <div className="mb-4 p-3 rounded bg-rose-50 border border-rose-200 text-rose-700">
                        {err}
                    </div>
                )}

                <form onSubmit={onSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Full Name *
                            </label>
                            <input
                                value={form.name}
                                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                                type="text"
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Enter full name"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Email *
                            </label>
                            <input
                                value={form.email}
                                onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                                type="email"
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="patient@example.com"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Password *
                            </label>
                            <input
                                value={form.password}
                                onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
                                type="password"
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Set a password"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Phone Number
                            </label>
                            <input
                                value={form.phoneNumber}
                                onChange={(e) => setForm((f) => ({ ...f, phoneNumber: e.target.value }))}
                                type="tel"
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Enter phone number"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Gender *
                            </label>
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

                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Address
                            </label>
                            <input
                                value={form.address}
                                onChange={(e) => setForm((f) => ({ ...f, address: e.target.value }))}
                                type="text"
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Enter full address"
                            />
                        </div>
                    </div>

                    <div className="flex justify-end">
                        <button
                            type="submit"
                            disabled={saving}
                            className={`text-white px-6 py-2 rounded-lg transition-colors ${saving ? "bg-blue-400" : "bg-blue-600 hover:bg-blue-700"
                                }`}
                        >
                            {saving ? "Adding…" : "Add Patient"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddPatient;
