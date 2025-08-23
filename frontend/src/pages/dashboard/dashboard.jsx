import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AdminPanel from "../admin/AdminPanel";
import DoctorPanel from "../doctor/DoctorPanel";
import PatientPanel from "../patients/PatientPanel";
import AddDoctor from "../doctor/AddDoctor";
import AddPatient from "../patients/AddPatient";
import Products from "../products/Products";
import AddProduct from "../products/AddProduct";
import DashboardOverview from "./DashboardOverview";

const Dashboard = () => {
    const [active, setActive] = useState("overview");
    const [isSidebarOpen, setSidebarOpen] = useState(true);
    const navigate = useNavigate();

    const toggleSidebar = () => {
        setSidebarOpen(!isSidebarOpen);
    };

    const buttons = [
        { id: "admin", label: "Admin", icon: "🛡️" },
        { id: "doctor", label: "Doctor", icon: "🩺" },
        { id: "add-doctor", label: "Add Doctor", icon: "➕" },
        { id: "patient", label: "Patient", icon: "👤" },
        { id: "add-patient", label: "Add Patient", icon: "➕" },
        { id: "product", label: "Products", icon: "💊" },
        { id: "add-product", label: "Add Product", icon: "➕" },
    ];

    return (
        <div className="flex min-h-screen bg-gray-100">
            <aside className={`fixed top-0 left-0 h-full transition-all duration-300 ease-in-out ${isSidebarOpen ? 'w-56' : 'w-20'} bg-gradient-to-b from-blue-600 via-blue-700 to-indigo-800 shadow-xl flex flex-col items-center py-8 z-40`}>
                {/* Toggle Button */}
                <button
                    onClick={toggleSidebar}
                    className="absolute -right-3 top-9 bg-white p-1.5 rounded-full shadow-lg hover:bg-gray-100 transition-colors duration-200"
                >
                    {isSidebarOpen ? '◀️' : '▶️'}
                </button>

                {/* Logo */}
                <div 
                    onClick={() => setActive("overview")} 
                    className={`mb-12 flex flex-col items-center cursor-pointer ${isSidebarOpen ? '' : 'scale-90'} hover:opacity-80 transition-opacity duration-200`}
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
                            className={`group flex items-center space-x-3 px-5 py-3 rounded-lg font-medium transition-all duration-300 w-full text-left ${
                                active === btn.id
                                    ? "bg-white bg-opacity-20 text-white shadow-lg backdrop-blur-sm"
                                    : "text-blue-100 hover:text-white hover:bg-white hover:bg-opacity-10"
                            }`}
                        >
                            <span className="text-xl group-hover:scale-110 transition-transform duration-300">{btn.icon}</span>
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
                        onClick={() => navigate("/")}
                        className="group flex items-center space-x-3 px-5 py-3 rounded-lg font-medium transition-all duration-300 w-full text-left text-blue-100 hover:text-white hover:bg-white hover:bg-opacity-10"
                    >
                        <span className="text-xl group-hover:scale-110 transition-transform duration-300">🏠</span>
                        {isSidebarOpen && (
                            <span className="text-base">Home</span>
                        )}
                    </button>
                </div>
            </aside>

            {/* Main Content Area */}
            <main className={`flex-1 ${isSidebarOpen ? 'ml-56' : 'ml-20'} transition-all duration-300`}>
                {active === "overview" && <DashboardOverview />}
                {active === "admin" && <AdminPanel />}
                {active === "doctor" && <DoctorPanel />}
                {active === "add-doctor" && <AddDoctor />}
                {active === "patient" && <PatientPanel />}
                {active === "add-patient" && <AddPatient />}
                {active === "product" && <Products />}
                {active === "add-product" && <AddProduct />}
            </main>
        </div>
    );
};

export default Dashboard;
