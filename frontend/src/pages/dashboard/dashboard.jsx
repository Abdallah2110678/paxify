import { useMemo, useState, useCallback, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

import AdminPanel from "../admin/AdminPanel";
import Doctors from "../doctor/Doctors";
import UpdateDoctor from "../doctor/UpdateDoctor";
import Pantients from "../patients/Patients";
import UpdatePatient from "../patients/UpdatePatient";
import AddDoctor from "./AddDoctor";
import AddPatient from "../patients/AddPatient";
import Products from "../products/Products";
import AddProduct from "../products/AddProduct";
import DashboardOverview from "./DashboardOverview";
import AdminDoctors from "./AdminDoctors";

const Dashboard = () => {
    const [active, setActive] = useState("overview");
    const [isSidebarOpen, setSidebarOpen] = useState(true);
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();

    const toggleSidebar = useCallback(() => setSidebarOpen((s) => !s), []);
    const goHome = useCallback(() => navigate("/"), [navigate]);

    const validTabs = useMemo(
        () =>
            new Set([
                "overview",
                "admin",
                "doctor",
                "add-doctor",
                "patient",
                "add-patient",
                "Applications",
                "product",
                "add-product",
            ]),
        []
    );

    // read ?tab= on load/changes
    useEffect(() => {
        const tab = searchParams.get("tab");
        if (tab && validTabs.has(tab)) setActive(tab);
        if (tab && !validTabs.has(tab)) setActive("overview");
    }, [searchParams, validTabs]);

    // write ?tab= when active changes via UI
    useEffect(() => {
        const next = validTabs.has(active) ? active : "overview";
        if (next === "overview") {
            setSearchParams({}, { replace: true });
        } else {
            setSearchParams({ tab: next, ...Object.fromEntries(searchParams) }, { replace: true });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [active, validTabs]);

    const buttons = useMemo(
        () => [
            { id: "admin", label: "Admin", icon: "🛡️" },
            { id: "doctor", label: "Doctors", icon: "🩺" },
            { id: "add-doctor", label: "Add Doctor", icon: "➕" },
            { id: "patient", label: "Patient", icon: "👤" },
            { id: "add-patient", label: "Add Patient", icon: "➕" },
            { id: "Applications", label: "Applications", icon: "🩺" },
            { id: "product", label: "Products", icon: "💊" },
            { id: "add-product", label: "Add Product", icon: "➕" },
        ],
        []
    );

    // edit params (if present, show edit pages inside the tab)
    const editDoctorId = searchParams.get("editDoctorId");
    const editPatientId = searchParams.get("editPatientId");

    // helper to clear edit mode
    const clearEditParam = (key) => {
        const next = new URLSearchParams(searchParams);
        next.delete(key);
        setSearchParams(Object.fromEntries(next), { replace: true });
    };

    return (
        <div className="flex min-h-screen bg-gray-100">
            {/* Sidebar */}
            <aside
                className={`fixed top-0 left-0 h-full transition-all duration-300 ease-in-out ${isSidebarOpen ? "w-56" : "w-20"
                    } bg-gradient-to-b from-blue-600 via-blue-700 to-indigo-800 shadow-xl flex flex-col items-center py-8 z-40`}
            >
                {/* Toggle Button */}
                <button
                    onClick={toggleSidebar}
                    className="absolute -right-3 top-9 bg-white p-1.5 rounded-full shadow-lg hover:bg-gray-100 transition-colors duration-200"
                >
                    {isSidebarOpen ? "◀️" : "▶️"}
                </button>

                {/* Logo */}
                <div
                    onClick={() => setActive("overview")}
                    className={`mb-12 flex flex-col items-center cursor-pointer ${isSidebarOpen ? "" : "scale-90"
                        } hover:opacity-80 transition-opacity duration-200`}
                >
                    <div className="relative mb-2">
                        <div className="w-14 h-14 bg-white bg-opacity-20 rounded-xl flex items-center justify-center backdrop-blur-sm overflow-hidden">
                            <img src="/logo.png" alt="Paxify Logo" className="w-10 h-10 object-contain" />
                        </div>
                        <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 rounded-full animate-pulse"></div>
                    </div>
                    {isSidebarOpen && (
                        <>
                            <span className="text-xl font-bold text-white tracking-wide">Paxify</span>
                            <span className="text-xs text-blue-200 opacity-80">Dashboard</span>
                        </>
                    )}
                </div>

                {/* Sidebar Buttons */}
                <div className="flex flex-col gap-4 w-full px-4 flex-1">
                    {buttons.map((btn) => (
                        <button
                            key={btn.id}
                            onClick={() => setActive(btn.id)}
                            className={`group flex items-center space-x-3 px-5 py-3 rounded-lg font-medium transition-all duration-300 w-full text-left ${active === btn.id
                                ? "bg-white bg-opacity-20 text-white shadow-lg backdrop-blur-sm"
                                : "text-blue-100 hover:text-white hover:bg-white hover:bg-opacity-10"
                                }`}
                        >
                            <span className="text-xl group-hover:scale-110 transition-transform duration-300">
                                {btn.icon}
                            </span>
                            {isSidebarOpen && (
                                <>
                                    <span className="text-base">{btn.label}</span>
                                    {active === btn.id && (
                                        <div className="ml-auto w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></div>
                                    )}
                                </>
                            )}
                        </button>
                    ))}
                </div>

                {/* Home Button */}
                <div className="w-full px-4 pb-4">
                    <button
                        onClick={goHome}
                        className="group flex items-center space-x-3 px-5 py-3 rounded-lg font-medium transition-all duration-300 w-full text-left text-blue-100 hover:text-white hover:bg-white hover:bg-opacity-10"
                    >
                        <span className="text-xl group-hover:scale-110 transition-transform duration-300">🏠</span>
                        {isSidebarOpen && <span className="text-base">Home</span>}
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className={`flex-1 ${isSidebarOpen ? "ml-56" : "ml-20"} transition-all duration-300`}>
                {active === "overview" && <DashboardOverview />}
                {active === "admin" && <AdminPanel />}

                {active === "doctor" &&
                    (editDoctorId ? (
                        <div className="p-6">
                            <div className="flex items-center justify-between mb-4">
                                <h1 className="text-3xl font-bold text-gray-800">Edit Doctor</h1>
                                <button
                                    onClick={() => clearEditParam("editDoctorId")}
                                    className="px-4 py-2 rounded-lg border border-slate-300 hover:bg-slate-50"
                                >
                                    ← Back to Doctors
                                </button>
                            </div>
                            <UpdateDoctor />
                        </div>
                    ) : (
                        <Doctors />
                    ))
                }


                {active === "add-doctor" && <AddDoctor />}

                {active === "patient" &&
                    (editPatientId ? (
                        <div className="p-6">
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-2xl font-bold">Edit Patient</h2>
                                <button
                                    onClick={() => clearEditParam("editPatientId")}
                                    className="px-3 py-1 rounded-lg border hover:bg-gray-50"
                                >
                                    ← Back to Patients
                                </button>
                            </div>
                            <UpdatePatient />
                        </div>
                    ) : (
                        <Pantients />
                    ))}

                {active === "add-patient" && <AddPatient />}
                {active === "Applications" && <AdminDoctors />}
                {active === "product" && <Products />}
                {active === "add-product" && <AddProduct />}
            </main>
        </div>
    );
};

export default Dashboard;
