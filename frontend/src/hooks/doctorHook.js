import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import {
  registerDoctor,
  getDoctors,
  deleteDoctor,
  createDoctor,
  getDoctorById,
  updateDoctor,
} from "../services/doctorService";
import {
  createAppointment,
  getAppointmentsByDoctor,
  updateAppointment,
  deleteAppointment as apiDeleteAppointment,
} from "../services/appointmentService";
import { toast } from "react-hot-toast";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";

// Single entry-point hook for all Doctor-related UI logic
export default function useDoctor(options = {}) {
  const { autoFetchList = false } = options;
  const navigate = useNavigate();
  const { user } = useAuth();

  // --- Register doctor ---
  const [regForm, setRegForm] = useState({
    name: "",
    email: "",
    password: "",
    phoneNumber: "",
    gender: "MALE",
    specialty: "",
    bio: "",
    consultationFee: "",
    availability: "",
  });
  const [regProfilePicture, setRegProfilePicture] = useState(null);
  const [regError, setRegError] = useState("");
  const [regSubmitting, setRegSubmitting] = useState(false);

  const regHandleChange = useCallback((e) => {
    setRegForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }, []);

  const regHandleFileChange = useCallback((e) => {
    setRegProfilePicture(e.target.files?.[0] || null);
  }, []);

  const regHandleSubmit = useCallback(
    async (e) => {
      e?.preventDefault?.();
      setRegError("");
      try {
        setRegSubmitting(true);
        const formData = new FormData();
        Object.keys(regForm).forEach((key) => {
          const val = regForm[key];
          if (val !== undefined && val !== null && String(val).length > 0) {
            formData.append(key, val);
          }
        });

        // Profile picture is now optional
        if (regProfilePicture) {
          formData.append("file", regProfilePicture);
        }
        await registerDoctor(formData);
        navigate("/login");
      } catch (err) {
        setRegError(
          err?.response?.data || err?.message || "Registration failed"
        );
      } finally {
        setRegSubmitting(false);
      }
    },
    [navigate, regForm, regProfilePicture]
  );

  const register = {
    form: regForm,
    profilePicture: regProfilePicture,
    error: regError,
    submitting: regSubmitting,
    setForm: setRegForm,
    handleChange: regHandleChange,
    handleFileChange: regHandleFileChange,
    handleSubmit: regHandleSubmit,
  };

  // --- Doctor dashboard ---
  const [dashActive, setDashActive] = useState("overview");
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const dashToggleSidebar = useCallback(() => setSidebarOpen((v) => !v), []);
  const dashGoHome = useCallback(() => navigate("/"), [navigate]);

  const dashboard = {
    active: dashActive,
    setActive: setDashActive,
    isSidebarOpen,
    toggleSidebar: dashToggleSidebar,
    goHome: dashGoHome,
  };

  // --- Doctors list (CRUD helpers) ---
  const idOf = (row) => row?.id || row?.userId || row?._id;
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");
  const [query, setQuery] = useState("");
  const [deletingId, setDeletingId] = useState(null);

  const fetchRows = useCallback(async () => {
    setLoading(true);
    setErr("");
    try {
      const list = await getDoctors();
      setRows(list);
    } catch (e) {
      setErr(
        e?.response?.data?.message || e.message || "Failed to load doctors"
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (autoFetchList) {
      fetchRows();
    }
  }, [autoFetchList, fetchRows]);

  const filtered = useMemo(() => {
    if (!query) return rows;
    const q = query.toLowerCase();
    return rows.filter((d) =>
      [d?.name, d?.email, d?.specialty, d?.address].some((v) =>
        String(v ?? "")
          .toLowerCase()
          .includes(q)
      )
    );
  }, [rows, query]);

  const onDelete = useCallback(async (row) => {
    const id = idOf(row);
    if (!id) return alert("Missing doctor id.");
    if (!confirm(`Delete doctor "${row?.name || row?.email || id}"?`)) return;
    try {
      setDeletingId(id);
      await deleteDoctor(id);
      setRows((prev) => prev.filter((r) => idOf(r) !== id));
    } catch (e) {
      alert(
        e?.response?.data?.message || e.message || "Failed to delete doctor"
      );
    } finally {
      setDeletingId(null);
    }
  }, []);

  const onEdit = useCallback(
    (row) => {
      const id = idOf(row);
      if (!id) return alert("Missing doctor id.");
      navigate(`/dashboard?tab=doctor&editDoctorId=${encodeURIComponent(id)}`);
    },
    [navigate]
  );

  const goAddDoctor = useCallback(
    () => navigate("/dashboard?tab=add-doctor"),
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
    goAddDoctor,
  };

  // --- Add Doctor (Admin flow) ---
  const [addForm, setAddForm] = useState({
    name: "",
    email: "",
    phoneNumber: "",
    address: "",
    password: "",
    role: "DOCTOR",
    gender: "",
    specialty: "",
  });
  const [addLoading, setAddLoading] = useState(false);

  const addHandleChange = useCallback((e) => {
    const { name, value } = e.target;
    setAddForm((prev) => ({ ...prev, [name]: value }));
  }, []);

  const addHandleSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      if (
        !addForm.name ||
        !addForm.email ||
        !addForm.password ||
        !addForm.gender ||
        !addForm.specialty
      ) {
        toast.error("Please fill all required fields");
        return;
      }
      try {
        setAddLoading(true);
        const payload = {
          name: addForm.name,
          email: addForm.email,
          phoneNumber: addForm.phoneNumber || null,
          address: addForm.address || null,
          password: addForm.password,
          role: addForm.role,
          gender: addForm.gender,
          specialty: addForm.specialty,
        };
        const { data } = await createDoctor(payload);
        toast.success(`Doctor ${data.name} added successfully!`);
        setAddForm({
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
        toast.error(
          error?.response?.data?.message || "Failed to create doctor"
        );
      } finally {
        setAddLoading(false);
      }
    },
    [addForm]
  );

  const addDoctor = {
    form: addForm,
    loading: addLoading,
    handleChange: addHandleChange,
    handleSubmit: addHandleSubmit,
  };

  // --- Add Appointment (Doctor flow) ---
  const [addApptForm, setAddApptForm] = useState({
    dateTime: "",
    sessionType: "ONLINE",
    price: "",
    durationMinutes: 60,
    notes: "",
  });
  const [addApptSubmitting, setAddApptSubmitting] = useState(false);
  const [addApptErr, setAddApptErr] = useState("");

  const addApptHandleChange = useCallback((e) => {
    const { name, value } = e.target;
    setAddApptForm((prev) => ({ ...prev, [name]: value }));
  }, []);

  const addApptHandleSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      setAddApptErr("");

      if (!user?.id) {
        setAddApptErr(
          "You must be logged in as a doctor to create appointments"
        );
        return;
      }

      try {
        setAddApptSubmitting(true);

        // Ensure seconds are present (backend expects yyyy-MM-dd'T'HH:mm:ss)
        const dateTimeIso =
          addApptForm.dateTime && addApptForm.dateTime.length === 16
            ? `${addApptForm.dateTime}:00`
            : addApptForm.dateTime;

        const maybePrice = (() => {
          const n = parseFloat(addApptForm.price);
          return Number.isFinite(n) ? n : undefined; // undefined -> omitted; backend will default to doctor's consultationFee
        })();

        const appointmentData = {
          doctorId: user.id,
          dateTime: dateTimeIso,
          sessionType: addApptForm.sessionType,
          durationMinutes: parseInt(addApptForm.durationMinutes) || 60,
          notes: addApptForm.notes || null,
          ...(maybePrice !== undefined ? { price: maybePrice } : {}),
        };

        await createAppointment(appointmentData);
        toast.success("Appointment created successfully!");

        // Reset form
        setAddApptForm({
          dateTime: "",
          sessionType: "ONLINE",
          price: "",
          durationMinutes: 60,
          notes: "",
        });
      } catch (e) {
        const errorMsg =
          e?.response?.data?.message ||
          e.message ||
          "Failed to add appointment";
        setAddApptErr(errorMsg);
        toast.error(errorMsg);
      } finally {
        setAddApptSubmitting(false);
      }
    },
    [addApptForm, user]
  );

  const addAppointment = {
    form: addApptForm,
    submitting: addApptSubmitting,
    err: addApptErr,
    handleChange: addApptHandleChange,
    handleSubmit: addApptHandleSubmit,
  };

  // Prefill add-appointment price with doctor's consultationFee once
  useEffect(() => {
    const loadDefaultFee = async () => {
      if (!user?.id) return;
      try {
        const data = await getDoctorById(user.id);
        const fee = data?.consultationFee;
        if (fee !== undefined && fee !== null) {
          setAddApptForm((prev) =>
            prev.price ? prev : { ...prev, price: String(fee) }
          );
        }
      } catch (_) {
        // ignore; fallback to manual entry
      }
    };
    loadDefaultFee();
    // run only when user.id changes
  }, [user?.id]);

  // --- Doctor Appointments (Dashboard list) ---
  const [apptRows, setApptRows] = useState([]);
  const [apptLoading, setApptLoading] = useState(false);
  const [apptErr, setApptErr] = useState("");
  const [apptFilter, setApptFilter] = useState("All");

  const apptFilters = useMemo(
    () => [
      { label: "All", value: "All" },
      { label: "Online", value: "ONLINE" },
      { label: "Offline", value: "IN_PERSON" },
    ],
    []
  );

  const apptLoad = useCallback(async () => {
    if (!user?.id) return;
    setApptLoading(true);
    setApptErr("");
    try {
      const data = await getAppointmentsByDoctor(user.id);
      const normalized = (Array.isArray(data) ? data : []).map((a) => ({
        ...a,
        // Backend entity uses 'appointmentDateTime'; frontend expects 'dateTime'
        dateTime:
          a?.dateTime ||
          a?.appointmentDateTime ||
          a?.appointment_date_time ||
          null,
      }));
      setApptRows(normalized);
    } catch (e) {
      const status = e?.response?.status;
      if (status === 403) {
        setApptErr(
          "You are not authorized to view doctor appointments. Please log in with a doctor account, or log out and log in again to refresh your token."
        );
      } else if (status === 401) {
        setApptErr("Your session has expired. Please log in again.");
      } else {
        setApptErr(
          e?.response?.data?.message ||
            e.message ||
            "Failed to load appointments"
        );
      }
    } finally {
      setApptLoading(false);
    }
  }, [user?.id]);

  useEffect(() => {
    apptLoad();
  }, [apptLoad]);

  const apptFormatDateTime = useCallback((val) => {
    if (val === null || val === undefined || val === "") return "-";
    try {
      // If backend sent array like [YYYY, MM, DD, HH, mm, ss, ns]
      if (Array.isArray(val)) {
        const [y, m, d, hh = 0, mm = 0, ss = 0] = val;
        // Note: month is 0-based in JS Date
        const date = new Date(y, (m || 1) - 1, d || 1, hh, mm, ss);
        if (!Number.isNaN(date.getTime())) {
          return date.toLocaleString([], {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
          });
        }
      }

      // If backend sent ISO string
      const d = new Date(val);
      if (!Number.isNaN(d.getTime())) {
        return d.toLocaleString([], {
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
          hour: "2-digit",
          minute: "2-digit",
        });
      }
      return String(val);
    } catch (_) {
      return String(val);
    }
  }, []);

  const apptFormatPrice = useCallback((p) => {
    if (p === null || p === undefined) return "-";
    const num = typeof p === "number" ? p : parseFloat(p);
    if (Number.isNaN(num)) return String(p);
    return `L.E ${num.toFixed(2)}`;
  }, []);

  const apptHumanType = useCallback((sessionType) => {
    const t = (sessionType || "").toUpperCase();
    if (t === "ONLINE") return "Online";
    if (t === "IN_PERSON") return "In-person";
    return sessionType || "-";
  }, []);

  const apptFiltered = useMemo(() => {
    if (apptFilter === "All") return apptRows;
    return apptRows.filter(
      (a) => (a?.sessionType || "").toUpperCase() === apptFilter
    );
  }, [apptRows, apptFilter]);

  const appointments = {
    rows: apptFiltered,
    rawRows: apptRows,
    loading: apptLoading,
    err: apptErr,
    filter: apptFilter,
    setFilter: setApptFilter,
    filters: apptFilters,
    refresh: apptLoad,
    format: {
      dateTime: apptFormatDateTime,
      price: apptFormatPrice,
      type: apptHumanType,
    },
  };

  // --- Edit/Delete appointment ---
  const [apptEditOpen, setApptEditOpen] = useState(false);
  const [apptEditingId, setApptEditingId] = useState(null);
  const [apptEditSaving, setApptEditSaving] = useState(false);
  const [apptEditErr, setApptEditErr] = useState("");
  const [apptEditForm, setApptEditForm] = useState({
    dateTime: "",
    sessionType: "ONLINE",
    price: "",
    durationMinutes: 60,
    notes: "",
  });

  const apptOpenEdit = useCallback((row) => {
    const id = row?.id || row?.appointmentId;
    if (!id) return;
    setApptEditingId(id);
    setApptEditErr("");
    // Prefill form from row
    setApptEditForm({
      dateTime: row?.dateTime || row?.appointmentDateTime || "",
      sessionType: row?.sessionType || "ONLINE",
      price: String(row?.price ?? ""),
      durationMinutes: row?.durationMinutes ?? 60,
      notes: row?.notes ?? "",
    });
    setApptEditOpen(true);
  }, []);

  const apptCloseEdit = useCallback(() => {
    setApptEditOpen(false);
    setApptEditingId(null);
    setApptEditSaving(false);
    setApptEditErr("");
  }, []);

  const apptEditChange = useCallback((e) => {
    const { name, value } = e.target;
    setApptEditForm((prev) => ({ ...prev, [name]: value }));
  }, []);

  const apptSubmitEdit = useCallback(
    async (e) => {
      e?.preventDefault?.();
      if (!apptEditingId) return;
      setApptEditSaving(true);
      setApptEditErr("");
      try {
        // Ensure seconds present if user passed yyyy-MM-ddTHH:mm
        const dt = apptEditForm.dateTime;
        const dateTimeIso =
          dt && typeof dt === "string" && dt.length === 16 ? `${dt}:00` : dt;
        const params = {
          dateTime: dateTimeIso || undefined,
          durationMinutes: apptEditForm.durationMinutes || undefined,
          sessionType: apptEditForm.sessionType || undefined,
          price:
            apptEditForm.price !== ""
              ? parseFloat(apptEditForm.price)
              : undefined,
          notes: apptEditForm.notes || undefined,
        };
        await updateAppointment(apptEditingId, params);
        toast.success("Appointment updated");
        setApptEditOpen(false);
        setApptEditingId(null);
        await apptLoad();
      } catch (e) {
        setApptEditErr(
          e?.response?.data?.message ||
            e.message ||
            "Failed to update appointment"
        );
      } finally {
        setApptEditSaving(false);
      }
    },
    [apptEditingId, apptEditForm, apptLoad]
  );

  const apptDelete = useCallback(
    async (row) => {
      const id = row?.id || row?.appointmentId;
      if (!id) return;
      if (!confirm("Delete this appointment?")) return;
      try {
        await apiDeleteAppointment(id);
        toast.success("Appointment deleted");
        await apptLoad();
      } catch (e) {
        toast.error(
          e?.response?.data?.message ||
            e.message ||
            "Failed to delete appointment"
        );
      }
    },
    [apptLoad]
  );

  appointments.actions = {
    openEdit: apptOpenEdit,
    delete: apptDelete,
  };
  appointments.edit = {
    open: apptEditOpen,
    saving: apptEditSaving,
    err: apptEditErr,
    form: apptEditForm,
    onChange: apptEditChange,
    onClose: apptCloseEdit,
    onSubmit: apptSubmitEdit,
  };

  // --- Update Doctor ---
  // --- Update Doctor ---
  const { id: routeDoctorParamId } = useParams();
  const [sp] = useSearchParams();
  const routeDoctorId = routeDoctorParamId || sp.get("editDoctorId");
  const [updLoading, setUpdLoading] = useState(false);
  const [updSaving, setUpdSaving] = useState(false);
  const [updErr, setUpdErr] = useState("");
  const [updForm, setUpdForm] = useState({
    name: "",
    email: "",
    specialty: "",
    address: "",
  });
  const [updProfilePicture, setUpdProfilePicture] = useState(null);

  const updLoad = useCallback(
    async (id = routeDoctorId) => {
      if (!id) return;
      setUpdLoading(true);
      setUpdErr("");
      try {
        const data = await getDoctorById(id);
        setUpdForm({
          name: data?.name || "",
          email: data?.email || "",
          specialty: data?.specialty || "",
          address: data?.address || "",
        });
      } catch (e) {
        setUpdErr(
          e?.response?.data?.message || e.message || "Failed to load doctor"
        );
      } finally {
        setUpdLoading(false);
      }
    },
    [routeDoctorId]
  );

  const updHandleFileChange = useCallback((e) => {
    const file = e.target.files?.[0] || null;
    setUpdProfilePicture(file);
  }, []);

  const updOnSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      const id = routeDoctorId;
      if (!id) return;
      setUpdSaving(true);
      setUpdErr("");
      try {
        if (updProfilePicture) {
          const fd = new FormData();
          if (updForm.name) fd.append("name", updForm.name);
          if (updForm.email) fd.append("email", updForm.email);
          if (updForm.specialty) fd.append("specialty", updForm.specialty);
          if (updForm.address) fd.append("address", updForm.address);
          fd.append("file", updProfilePicture);
          fd.append("profilePicture", updProfilePicture);
          await updateDoctor(id, fd);
        } else {
          const payload = {
            name: updForm.name || null,
            email: updForm.email || null,
            specialty: updForm.specialty || null,
            address: updForm.address || null,
          };
          await updateDoctor(id, payload);
        }
        navigate("/dashboard/doctors");
      } catch (e) {
        setUpdErr(
          e?.response?.data?.message || e.message || "Failed to update doctor"
        );
        setUpdSaving(false);
      }
    },
    [routeDoctorId, updForm, updProfilePicture, navigate]
  );

  const goBack = useCallback(() => navigate(-1), [navigate]);
  const goDoctors = useCallback(
    () => navigate("/dashboard/doctors"),
    [navigate]
  );

  const update = {
    id: routeDoctorId,
    form: updForm,
    setForm: setUpdForm,
    profilePicture: updProfilePicture,
    handleFileChange: updHandleFileChange,
    loading: updLoading,
    saving: updSaving,
    err: updErr,
    onSubmit: updOnSubmit,
    load: updLoad,
    goBack,
    goDoctors,
  };

  return {
    register,
    dashboard,
    list,
    addDoctor,
    addAppointment,
    appointments,
    update,
  };
}
