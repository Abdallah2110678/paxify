import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { registerDoctor, getDoctors, deleteDoctor, createDoctor, getDoctorById, updateDoctor } from "../services/doctorService";
import { toast } from "react-hot-toast";

// Single entry-point hook for all Doctor-related UI logic
export default function useDoctor() {
  const navigate = useNavigate();

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

  const regHandleSubmit = useCallback(async (e) => {
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
      if (regProfilePicture) formData.append("file", regProfilePicture);
      await registerDoctor(formData);
      navigate("/login");
    } catch (err) {
      setRegError(err?.response?.data || err?.message || "Registration failed");
    } finally {
      setRegSubmitting(false);
    }
  }, [navigate, regForm, regProfilePicture]);

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
  const [loading, setLoading] = useState(true);
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
      setErr(e?.response?.data?.message || e.message || "Failed to load doctors");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRows();
  }, [fetchRows]);

  const filtered = useMemo(() => {
    if (!query) return rows;
    const q = query.toLowerCase();
    return rows.filter((d) => [d?.name, d?.email, d?.specialty, d?.address]
      .some((v) => String(v ?? "").toLowerCase().includes(q)));
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
      alert(e?.response?.data?.message || e.message || "Failed to delete doctor");
    } finally {
      setDeletingId(null);
    }
  }, []);

  const onEdit = useCallback((row) => {
    const id = idOf(row);
    if (!id) return alert("Missing doctor id.");
    navigate(`/dashboard/doctors/${id}/edit`);
  }, [navigate]);

  const goAddDoctor = useCallback(() => navigate("/dashboard/add-doctor"), [navigate]);

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

  const addHandleSubmit = useCallback(async (e) => {
    e.preventDefault();
    if (!addForm.name || !addForm.email || !addForm.password || !addForm.gender || !addForm.specialty) {
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
      toast.error(error?.response?.data?.message || "Failed to create doctor");
    } finally {
      setAddLoading(false);
    }
  }, [addForm]);

  const addDoctor = { form: addForm, loading: addLoading, handleChange: addHandleChange, handleSubmit: addHandleSubmit };

  // --- Add Appointment (Doctor flow) ---
  const [addApptForm, setAddApptForm] = useState({ dateTime: "", sessionType: "Online", price: "" });
  const [addApptSubmitting, setAddApptSubmitting] = useState(false);
  const [addApptErr, setAddApptErr] = useState("");

  const addApptHandleChange = useCallback((e) => {
    const { name, value } = e.target;
    setAddApptForm((prev) => ({ ...prev, [name]: value }));
  }, []);

  const addApptHandleSubmit = useCallback(async (e) => {
    e.preventDefault();
    setAddApptErr("");
    try {
      setAddApptSubmitting(true);
      // TODO: integrate backend service once API is ready
      // await createAppointment(addApptForm)
      console.log("Submitting Appointment:", addApptForm);
    } catch (e) {
      setAddApptErr(e?.response?.data?.message || e.message || "Failed to add appointment");
    } finally {
      setAddApptSubmitting(false);
    }
  }, [addApptForm]);

  const addAppointment = { form: addApptForm, submitting: addApptSubmitting, err: addApptErr, handleChange: addApptHandleChange, handleSubmit: addApptHandleSubmit };

  // --- Update Doctor ---
  const { id: routeDoctorId } = useParams();
  const [updLoading, setUpdLoading] = useState(false);
  const [updSaving, setUpdSaving] = useState(false);
  const [updErr, setUpdErr] = useState("");
  const [updForm, setUpdForm] = useState({ name: "", email: "", specialty: "", address: "" });
  const [updProfilePicture, setUpdProfilePicture] = useState(null);

  const updLoad = useCallback(async (id = routeDoctorId) => {
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
      setUpdErr(e?.response?.data?.message || e.message || "Failed to load doctor");
    } finally {
      setUpdLoading(false);
    }
  }, [routeDoctorId]);

  const updHandleFileChange = useCallback((e) => {
    const file = e.target.files?.[0] || null;
    setUpdProfilePicture(file);
  }, []);

  const updOnSubmit = useCallback(async (e) => {
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
      setUpdErr(e?.response?.data?.message || e.message || "Failed to update doctor");
      setUpdSaving(false);
    }
  }, [routeDoctorId, updForm, updProfilePicture, navigate]);

  const goBack = useCallback(() => navigate(-1), [navigate]);
  const goDoctors = useCallback(() => navigate("/dashboard/doctors"), [navigate]);

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

  return { register, dashboard, list, addDoctor, addAppointment, update };
}
