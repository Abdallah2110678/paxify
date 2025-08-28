// src/App.jsx
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/navbar/navbar.jsx";
import Footer from "./components/footer/footer.jsx";
import Home from "./pages/home/home.jsx";
import Dashboard from "./pages/dashboard/dashboard.jsx";
import BookSession from "./pages/book/BookSession.jsx";
import FindTherapists from "./pages/therapists/FindTherapists.jsx";
import Games from "./pages/games/Games.jsx";
import About from "./pages/about/About.jsx";
import Profile from "./pages/profile/Profile.jsx";
import DoctorDashboard from "./pages/doctor/DoctorDashboard.jsx";
import PatientDashboard from "./pages/patients/PatientDashboard.jsx";
import Login from "./pages/login/Login.jsx";
import Register from "./pages/register/Register.jsx";
import ProtectedRoute from "./auth/ProtectedRoute.jsx";
import DoctorRegister from "./pages/doctor/DoctorRegister.jsx";

// Doctor admin pages (in src/pages/doctor)
import Doctors from "./pages/doctor/Doctors.jsx";
import UpdateDoctor from "./pages/doctor/UpdateDoctor.jsx";

// AddDoctor (per your tree) in src/pages/dashboard
import AddDoctor from "./pages/dashboard/AddDoctor.jsx";

// Patient admin pages (in src/pages/patients)
import PatientPanel from "./pages/patients/PatientPanel.jsx";
import AddPatient from "./pages/patients/AddPatient.jsx";
import UpdatePatient from "./pages/patients/UpdatePatient.jsx";

function App() {
  return (
    <Router>
      <Routes>
        {/* ===== Admin-only ===== */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute roles={["ADMIN"]}>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        {/* Doctors CRUD */}
        <Route
          path="/dashboard/doctors"
          element={
            <ProtectedRoute roles={["ADMIN"]}>
              <Doctors />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/doctors/:id/edit"
          element={
            <ProtectedRoute roles={["ADMIN"]}>
              <UpdateDoctor />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/add-doctor"
          element={
            <ProtectedRoute roles={["ADMIN"]}>
              <AddDoctor />
            </ProtectedRoute>
          }
        />
        {/* Patients CRUD */}
        <Route
          path="/dashboard/patients"
          element={
            <ProtectedRoute roles={["ADMIN"]}>
              <PatientPanel />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/patients/:id/edit"
          element={
            <ProtectedRoute roles={["ADMIN"]}>
              <UpdatePatient />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/add-patient"
          element={
            <ProtectedRoute roles={["ADMIN"]}>
              <AddPatient />
            </ProtectedRoute>
          }
        />

        {/* ===== Doctor & Patient dashboards ===== */}
        <Route
          path="/doctor-dashboard"
          element={
            <ProtectedRoute roles={["DOCTOR"]}>
              <DoctorDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/patient-dashboard"
          element={
            <ProtectedRoute roles={["PATIENT"]}>
              <PatientDashboard />
            </ProtectedRoute>
          }
        />

        {/* ===== Public site with Navbar/Footer ===== */}
        <Route
          path="*"
          element={
            <>
              <Navbar />
              <div className="pt-20 pb-16 min-h-screen bg-gray-50">
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/book" element={<BookSession />} />
                  <Route path="/therapists" element={<FindTherapists />} />
                  <Route path="/games" element={<Games />} />
                  <Route path="/about" element={<About />} />
                  <Route path="/profile" element={<Profile />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                  <Route path="/doctor-register" element={<DoctorRegister />} />
                </Routes>
              </div>
              <Footer />
            </>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
