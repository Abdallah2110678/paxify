import { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getPatientById, updatePatient } from "../services/patientService";

export default function useUpdatePatient() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState("");
  const [form, setForm] = useState({
    name: "",
    email: "",
    phoneNumber: "",
    address: "",
    gender: "",
  });

  const load = useCallback(async () => {
    setLoading(true);
    setErr("");
    try {
      const data = await getPatientById(id);
      setForm({
        name: data?.name || "",
        email: data?.email || "",
        phoneNumber: data?.phoneNumber || "",
        address: data?.address || "",
        gender: data?.gender || "",
      });
    } catch (e) {
      setErr(e?.response?.data?.message || e.message || "Failed to load patient");
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    load();
  }, [load]);

  const onSubmit = useCallback(async (e) => {
    e.preventDefault();
    setSaving(true);
    setErr("");
    try {
      const payload = {
        name: form.name || null,
        email: form.email || null,
        phoneNumber: form.phoneNumber || null,
        address: form.address || null,
        gender: form.gender ? form.gender.toUpperCase() : null,
      };
      await updatePatient(id, payload);
      navigate("/dashboard/patients");
    } catch (e) {
      setErr(e?.response?.data?.message || e.message || "Failed to update patient");
      setSaving(false);
    }
  }, [form, id, navigate]);

  const goBack = useCallback(() => navigate(-1), [navigate]);
  const goPatients = useCallback(() => navigate("/dashboard/patients"), [navigate]);

  return { id, form, setForm, loading, saving, err, onSubmit, load, goBack, goPatients };
}
