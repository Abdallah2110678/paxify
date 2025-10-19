import { BrowserRouter as Router, Routes, Route, Navigate, useParams } from "react-router-dom";
import Navbar from "./components/navbar/navbar.jsx";
import Footer from "./components/footer/footer.jsx";
import Home from "./pages/home/home.jsx";
import Dashboard from "./pages/dashboard/dashboard.jsx";
import OurProducts from "./pages/products/OurProducts.jsx";
import FindTherapistsContainer from "./pages/therapists/FindTherapistsContainer.jsx";
import Games from "./pages/games/Games.jsx";
import About from "./pages/about/About.jsx";
import Profile from "./pages/profile/Profile.jsx";
import DoctorDashboard from "./pages/doctor/DoctorDashboard.jsx";
import PatientDashboard from "./pages/patients/PatientDashboard.jsx";
import Login from "./pages/login/Login.jsx";
import Register from "./pages/register/Register.jsx";
import ProtectedRoute from "./auth/ProtectedRoute.jsx";
import DoctorRegister from "./pages/doctor/DoctorRegister.jsx";
import DoctorDescriptionContainer from "./pages/doctor/DoctorDescriptionContainer.jsx";
import AdminDoctorDetails from "./pages/dashboard/AdminDoctorDetails.jsx";
import Cart from "./pages/products/Cart.jsx";
import ProductDetails from "./pages/products/ProductDetails.jsx";

// Small helpers to redirect dynamic :id routes into the tabbed dashboard
function RedirectEditDoctor() {
  const { id } = useParams();
  return <Navigate to={`/dashboard?tab=doctor&editDoctorId=${encodeURIComponent(id)}`} replace />;
}
function RedirectEditPatient() {
  const { id } = useParams();
  return <Navigate to={`/dashboard?tab=patient&editPatientId=${encodeURIComponent(id)}`} replace />;
}

function App() {
  return (
    <Router>
      <Routes>
        {/* ===== Single Dashboard route (with sidebar/tabs) ===== */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute roles={["ADMIN"]}>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        {/* ===== Redirect old deep links to tabbed dashboard ===== */}
        <Route path="/dashboard/doctors" element={<Navigate to="/dashboard?tab=doctor" replace />} />
        <Route path="/dashboard/add-doctor" element={<Navigate to="/dashboard?tab=add-doctor" replace />} />
        <Route path="/dashboard/patients" element={<Navigate to="/dashboard?tab=patient" replace />} />
        <Route path="/dashboard/add-patient" element={<Navigate to="/dashboard?tab=add-patient" replace />} />
        <Route path="/dashboard/doctors/:id" element={<AdminDoctorDetails />} />
        <Route path="/dashboard/products" element={<Navigate to="/dashboard?tab=product" replace />} />
        <Route path="/dashboard/add-product" element={<Navigate to="/dashboard?tab=add-product" replace />} />
        <Route
          path="/dashboard/doctors/:id/edit"
          element={
            <ProtectedRoute roles={["ADMIN"]}>
              <RedirectEditDoctor />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/patients/:id/edit"
          element={
            <ProtectedRoute roles={["ADMIN"]}>
              <RedirectEditPatient />
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
                  <Route path="/Our Products" element={<OurProducts />} />
                  <Route path="/products/:id" element={<ProductDetails />} />
                  <Route path="/therapists" element={<FindTherapistsContainer />} />
                  <Route path="/doctors/:id" element={<DoctorDescriptionContainer />} />
                  <Route path="/games" element={<Games />} />
                  <Route path="/about" element={<About />} />
                  <Route path="/profile" element={<Profile />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                  <Route path="/doctor-register" element={<DoctorRegister />} />
                  <Route path="/cart" element={<Cart />} />
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