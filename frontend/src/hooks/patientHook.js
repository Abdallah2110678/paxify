import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import {
  getPatients,
  deletePatient,
  getPatientById,
  updatePatient,
  createPatient,
} from "../services/patientService";
import { useAuth } from "../context/AuthContext.jsx";

// Single entry-point hook for all Patient-related UI logic
export default function usePatient() {
  const navigate = useNavigate();
  const { user } = useAuth();

  // --- Patient dashboard ---
  const [dashActive, setDashActive] = useState("overview");
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const toggleSidebar = useCallback(() => setSidebarOpen((s) => !s), []);
  const goHome = useCallback(() => navigate("/"), [navigate]);
  const dashboard = {
    active: dashActive,
    setActive: setDashActive,
    isSidebarOpen,
    toggleSidebar,
    goHome,
  };

  // --- Patients list (CRUD helpers) ---
  const idOf = (row) => row?.id || row?._id || row?.userId;
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");
  const [query, setQuery] = useState("");
  const [deletingId, setDeletingId] = useState(null);

  const fetchRows = useCallback(async () => {
    setLoading(true);
    setErr("");
    try {
      const list = await getPatients();
      setRows(list);
    } catch (e) {
      setErr(
        e?.response?.data?.message || e.message || "Failed to load patients"
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (user && user.role === "ADMIN") {
      fetchRows();
    } else {
      setLoading(false);
      setErr(
        user
          ? "You are not authorized to view patients (ADMIN only)."
          : "Please log in as an admin to view patients."
      );
    }
  }, [fetchRows, user]);

  const filtered = useMemo(() => {
    if (!query) return rows;
    const q = query.toLowerCase();
    return rows.filter((p) =>
      [p?.name, p?.email, p?.phoneNumber, p?.address, p?.gender].some((v) =>
        String(v ?? "")
          .toLowerCase()
          .includes(q)
      )
    );
  }, [rows, query]);

  const onDelete = useCallback(async (row) => {
    const id = idOf(row);
    if (!id) return;

    try {
      setDeletingId(id);
      await deletePatient(id);
      setRows((prev) => prev.filter((r) => idOf(r) !== id));
    } catch (e) {
      setErr(
        e?.response?.data?.message || e.message || "Failed to delete patient"
      );
    } finally {
      setDeletingId(null);
    }
  }, []);

  const onEdit = useCallback(
    (row) => {
      const id = idOf(row);
      if (!id) return;
      navigate(`/dashboard/patients/${id}/edit`);
    },
    [navigate]
  );

  const goAddPatient = useCallback(
    () => navigate("/dashboard/add-patient"),
    [navigate]
  );

  const list = {
    rows,
    loading,
    err,
    query,
    setQuery,
    deletingId,
    filtered,
    fetchRows,
    onDelete,
    onEdit,
    goAddPatient,
  };

  // --- Add patient ---
  const [addForm, setAddForm] = useState({
    name: "",
    email: "",
    password: "",
    phoneNumber: "",
    address: "",
    gender: "",
  });
  const [addSaving, setAddSaving] = useState(false);
  const [addErr, setAddErr] = useState("");

  const addOnSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      setAddErr("");
      if (!user || user.role !== "ADMIN") {
        setAddErr(
          "Only admins can create patients. Please log in as an admin."
        );
        return;
      }
      if (
        !addForm.name ||
        !addForm.email ||
        !addForm.password ||
        !addForm.gender
      ) {
        setAddErr("Name, Email, Password and Gender are required.");
        return;
      }
      try {
        setAddSaving(true);
        await createPatient({
          name: addForm.name,
          email: addForm.email,
          password: addForm.password,
          phoneNumber: addForm.phoneNumber || null,
          address: addForm.address || null,
          gender: addForm.gender,
        });
        navigate("/dashboard/patients");
      } catch (e) {
        const status = e?.response?.status;
        if (status === 403) {
          setAddErr(
            "Forbidden: You do not have permission to create patients."
          );
        } else {
          setAddErr(
            e?.response?.data?.message || e.message || "Failed to add patient"
          );
        }
        setAddSaving(false);
      }
    },
    [addForm, navigate, user]
  );

  const addGoBack = useCallback(() => navigate(-1), [navigate]);

  const addPatient = {
    form: addForm,
    setForm: setAddForm,
    saving: addSaving,
    err: addErr,
    onSubmit: addOnSubmit,
    goBack: addGoBack,
  };

  // --- Update patient ---
  const { id: routePatientParamId } = useParams();
  const [sp] = useSearchParams();
  const routePatientId = routePatientParamId || sp.get("editPatientId");
  const [updLoading, setUpdLoading] = useState(false);
  const [updSaving, setUpdSaving] = useState(false);
  const [updErr, setUpdErr] = useState("");
  const [updForm, setUpdForm] = useState({
    name: "",
    email: "",
    phoneNumber: "",
    address: "",
    gender: "",
  });

  const updLoad = useCallback(
    async (id = routePatientId) => {
      if (!id) return;
      setUpdLoading(true);
      setUpdErr("");
      try {
        const data = await getPatientById(id);
        setUpdForm({
          name: data?.name || "",
          email: data?.email || "",
          phoneNumber: data?.phoneNumber || "",
          address: data?.address || "",
          gender: data?.gender || "",
        });
      } catch (e) {
        setUpdErr(
          e?.response?.data?.message || e.message || "Failed to load patient"
        );
      } finally {
        setUpdLoading(false);
      }
    },
    [routePatientId]
  );

  const updOnSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      const id = routePatientId;
      if (!id) return;
      setUpdSaving(true);
      setUpdErr("");
      try {
        const payload = {
          name: updForm.name || null,
          email: updForm.email || null,
          phoneNumber: updForm.phoneNumber || null,
          address: updForm.address || null,
          gender: updForm.gender ? updForm.gender.toUpperCase() : null,
        };
        await updatePatient(id, payload);
        navigate("/dashboard/patients");
      } catch (e) {
        setUpdErr(
          e?.response?.data?.message || e.message || "Failed to update patient"
        );
        setUpdSaving(false);
      }
    },
    [routePatientId, updForm, navigate]
  );

  const goBack = useCallback(() => navigate(-1), [navigate]);
  const goPatients = useCallback(
    () => navigate("/dashboard/patients"),
    [navigate]
  );

  const update = {
    id: routePatientId,
    form: updForm,
    setForm: setUpdForm,
    loading: updLoading,
    saving: updSaving,
    err: updErr,
    onSubmit: updOnSubmit,
    load: updLoad,
    goBack,
    goPatients,
  };

  return { dashboard, list, addPatient, update };
}

// Booking patient mini-hook used by the Doctor Description booking modal
// Keeps all form logic in this patientHook file as requested
export function useBookingPatientForm(initial = {}) {
  const [form, setForm] = useState({
    name: initial.name || "",
    phone: initial.phone || "",
    email: initial.email || "",
    paymentMethod: (initial.paymentMethod || "CASH").toUpperCase(),
  });

  const setName = useCallback((v) => setForm((p) => ({ ...p, name: v })), []);
  const setPhone = useCallback((v) => setForm((p) => ({ ...p, phone: v })), []);
  const setEmail = useCallback((v) => setForm((p) => ({ ...p, email: v })), []);
  const setPaymentMethod = useCallback((v) => setForm((p) => ({ ...p, paymentMethod: String(v || "CASH").toUpperCase() })), []);
  const reset = useCallback(() => setForm({ name: "", phone: "", email: "", paymentMethod: "CASH" }), []);

  const canBook = Boolean(form.name && form.phone);

  return { form, setName, setPhone, setEmail, setPaymentMethod, reset, canBook };
}

import { getMyAppointments, cancelMyAppointment } from "../services/appointmentService";
import { toast } from "react-hot-toast";

export function usePatientAppointments() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Ensure a token exists; actual patient ID is derived on the server from JWT
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setError("Please log in to view appointments.");
      setLoading(false);
    }
  }, []);

  const formatters = {
    toDateTimeLabels(value) {
      try {
        let dateObj;
        if (Array.isArray(value)) {
          const [year, month, day, hour = 0, minute = 0, second = 0] = value;
          dateObj = new Date(year, (month || 1) - 1, day || 1, hour, minute, second);
        } else {
          dateObj = new Date(value);
        }
        if (!Number.isNaN(dateObj.getTime())) {
          return {
            dateLabel: dateObj.toLocaleDateString([], { year: "numeric", month: "2-digit", day: "2-digit" }),
            timeLabel: dateObj.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          };
        }
      } catch (_) {}
      return { dateLabel: "-", timeLabel: "-" };
    },
    toPriceLabel(value) {
      if (value == null) return "";
      const numeric = typeof value === "number" ? value : parseFloat(value);
      return Number.isFinite(numeric) ? `L.E ${numeric.toFixed(2)}` : String(value);
    },
    toSessionTypeLabel(value) {
      const normalized = String(value || "").toUpperCase();
      if (normalized === "ONLINE") return "Online";
      if (normalized === "IN_PERSON") return "In person";
      return value || "-";
    },
  };

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const data = await getMyAppointments();
      const list = Array.isArray(data) ? data : [];
      const mapped = list.map((row) => {
        const { dateLabel, timeLabel } = formatters.toDateTimeLabels(
          row.dateTime || row.appointmentDateTime || row.date_time
        );
        return {
          id: row.id,
          doctorId: row.doctorId,
          doctorName: row.doctorName,
          dateLabel,
          timeLabel,
          sessionTypeLabel: formatters.toSessionTypeLabel(row.sessionType),
          priceLabel: formatters.toPriceLabel(row.price),
          raw: row,
        };
      });
      setItems(mapped);
    } catch (e) {
      setError(e?.response?.data?.message || e.message || "Failed to load appointments");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const onCancel = useCallback(async (appointmentId) => {
    if (!appointmentId) return;
    const promise = cancelMyAppointment(appointmentId);
    await toast.promise(promise, {
      loading: "Cancelling…",
      success: "Appointment cancelled",
      error: (e) => e?.response?.data?.message || e.message || "Failed to cancel",
    });
    setItems((prev) => prev.filter((it) => it.id !== appointmentId));
  }, []);

  return { loading, error, items, onCancel, refresh: load };
}
