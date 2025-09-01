import { useEffect, useState, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getDoctorById, updateDoctor } from "../services/doctorService";

export default function useUpdateDoctor() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState("");
  const [form, setForm] = useState({ name: "", email: "", specialty: "", address: "" });
  const [profilePicture, setProfilePicture] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    setErr("");
    try {
      const data = await getDoctorById(id);
      setForm({
        name: data?.name || "",
        email: data?.email || "",
        specialty: data?.specialty || "",
        address: data?.address || "",
      });
    } catch (e) {
      setErr(e?.response?.data?.message || e.message || "Failed to load doctor");
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    load();
  }, [load]);

  const handleFileChange = useCallback((e) => {
    const file = e.target.files?.[0] || null;
    setProfilePicture(file);
  }, []);

  const onSubmit = useCallback(async (e) => {
    e.preventDefault();
    setSaving(true);
    setErr("");
    try {
      if (profilePicture) {
        const fd = new FormData();
        if (form.name) fd.append("name", form.name);
        if (form.email) fd.append("email", form.email);
        if (form.specialty) fd.append("specialty", form.specialty);
        if (form.address) fd.append("address", form.address);
        // Add both possible keys for compatibility
        fd.append("file", profilePicture);
        fd.append("profilePicture", profilePicture);
        await updateDoctor(id, fd);
      } else {
        const payload = {
          name: form.name || null,
          email: form.email || null,
          specialty: form.specialty || null,
          address: form.address || null,
        };
        await updateDoctor(id, payload);
      }
      navigate("/dashboard/doctors");
    } catch (e) {
      setErr(e?.response?.data?.message || e.message || "Failed to update doctor");
      setSaving(false);
    }
  }, [form, profilePicture, id, navigate]);

  const goBack = useCallback(() => navigate(-1), [navigate]);
  const goDoctors = useCallback(() => navigate("/dashboard/doctors"), [navigate]);

  return { id, form, setForm, profilePicture, handleFileChange, loading, saving, err, onSubmit, goBack, goDoctors };
}
