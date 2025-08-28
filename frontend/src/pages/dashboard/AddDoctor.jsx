import { useState } from "react";
import api from "../../lib/axios.jsx";
import { toast } from "react-hot-toast";

const AddDoctor = () => {
    const [form, setForm] = useState({
        name: "",
        email: "",
        phoneNumber: "",
        address: "",
        password: "",
        role: "DOCTOR",
        gender: "",
        specialty: "",
    });

    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Simple form validation
        if (!form.name || !form.email || !form.password || !form.gender || !form.specialty) {
            toast.error("Please fill all required fields");
            return;
        }

        try {
            setLoading(true);

            const payload = {
                name: form.name,
                email: form.email,
                phoneNumber: form.phoneNumber || null,
                address: form.address || null,
                password: form.password,
                role: form.role,
                gender: form.gender,
                specialty: form.specialty,
            };

            const { data } = await api.post("/api/users/doctors", payload);

            toast.success(`Doctor ${data.name} added successfully!`);

            // Reset form
            setForm({
                name: "",
                email: "",
                phoneNumber: "",
                address: "",
                password: "",
                role: "DOCTOR",
                gender: "",
                specialty: "",
            });
        } catch (error) {
            console.error(error);
            toast.error(error.response?.data?.message || "Failed to create doctor");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-6">
            <div className="bg-white rounded-lg shadow-lg p-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">Add New Doctor</h2>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Name */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                            <input
                                type="text"
                                name="name"
                                value={form.name}
                                onChange={handleChange}
                                required
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Enter full name"
                            />
                        </div>

                        {/* Email */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                            <input
                                type="email"
                                name="email"
                                value={form.email}
                                onChange={handleChange}
                                required
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="doctor@example.com"
                            />
                        </div>

                        {/* Phone */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                            <input
                                type="tel"
                                name="phoneNumber"
                                value={form.phoneNumber}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Enter phone number"
                            />
                        </div>

                        {/* Address */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
                            <input
                                type="text"
                                name="address"
                                value={form.address}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Enter address"
                            />
                        </div>

                        {/* Password */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
                            <input
                                type="password"
                                name="password"
                                value={form.password}
                                onChange={handleChange}
                                required
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Enter password"
                            />
                        </div>

                        {/* Gender */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Gender</label>
                            <select
                                name="gender"
                                value={form.gender}
                                onChange={handleChange}
                                required
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="">Select gender</option>
                                <option value="MALE">Male</option>
                                <option value="FEMALE">Female</option>
                                <option value="OTHER">Other</option>
                            </select>
                        </div>

                        {/* Specialty */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Specialty</label>
                            <input
                                type="text"
                                name="specialty"
                                value={form.specialty}
                                onChange={handleChange}
                                required
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Enter doctor's specialty"
                            />
                        </div>
                    </div>

                    {/* Submit Button */}
                    <div className="flex justify-end">
                        <button
                            type="submit"
                            disabled={loading}
                            className={`${loading ? "bg-blue-400" : "bg-blue-600 hover:bg-blue-700"
                                } text-white px-6 py-2 rounded-lg transition-colors`}
                        >
                            {loading ? "Adding Doctor..." : "Add Doctor"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddDoctor;
