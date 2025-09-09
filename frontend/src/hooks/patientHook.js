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
    if (!id) return alert("Missing patient id.");
    if (!confirm(`Delete patient "${row?.name || row?.email || id}"?`)) return;
    try {
      setDeletingId(id);
      await deletePatient(id);
      setRows((prev) => prev.filter((r) => idOf(r) !== id));
    } catch (e) {
      alert(
        e?.response?.data?.message || e.message || "Failed to delete patient"
      );
    } finally {
      setDeletingId(null);
    }
  }, []);

  const onEdit = useCallback(
    (row) => {
      const id = idOf(row);
      if (!id) return alert("Missing patient id.");
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
      // Only ADMIN can create patients
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
            "Forbidden: You do not have permission to create patients. Log in as an admin."
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
