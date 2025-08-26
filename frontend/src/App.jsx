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

function App() {
  return (
    <Router>
      <Routes>
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute roles={["ADMIN"]}>
              <Dashboard />
            </ProtectedRoute>
          }
        />
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
