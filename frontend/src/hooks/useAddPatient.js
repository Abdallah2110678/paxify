import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { createPatient } from "../services/patientService";

export default function useAddPatient() {
  const navigate = useNavigate();
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState("");
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    phoneNumber: "",
    address: "",
    gender: "",
  });

  const onSubmit = useCallback(async (e) => {
    e.preventDefault();
    setErr("");
    if (!form.name || !form.email || !form.password || !form.gender) {
      setErr("Name, Email, Password and Gender are required.");
      return;
    }
    try {
      setSaving(true);
      await createPatient({
        name: form.name,
        email: form.email,
        password: form.password,
        phoneNumber: form.phoneNumber || null,
        address: form.address || null,
        gender: form.gender,
      });
      navigate("/dashboard/patients");
    } catch (e) {
      setErr(e?.response?.data?.message || e.message || "Failed to add patient");
      setSaving(false);
    }
  }, [form, navigate]);

  const goBack = useCallback(() => navigate(-1), [navigate]);

  return { form, setForm, saving, err, onSubmit, goBack };
}
