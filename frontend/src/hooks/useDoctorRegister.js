import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { registerDoctor } from "../services/doctorService";

export default function useDoctorRegister() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
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
  const [profilePicture, setProfilePicture] = useState(null);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleChange = useCallback((e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }, []);

  const handleFileChange = useCallback((e) => {
    setProfilePicture(e.target.files?.[0] || null);
  }, []);

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    setError("");
    try {
      setSubmitting(true);
      const formData = new FormData();
      Object.keys(form).forEach((key) => {
        if (form[key] !== undefined && form[key] !== null && String(form[key]).length > 0) {
          formData.append(key, form[key]);
        }
      });
      if (profilePicture) formData.append("file", profilePicture);
      await registerDoctor(formData);
      alert("Doctor registered successfully!");
      navigate("/login");
    } catch (err) {
      setError(err?.response?.data || err?.message || "Registration failed");
    } finally {
      setSubmitting(false);
    }
  }, [form, profilePicture, navigate]);

  return { form, profilePicture, error, submitting, setForm, handleChange, handleFileChange, handleSubmit };
}
